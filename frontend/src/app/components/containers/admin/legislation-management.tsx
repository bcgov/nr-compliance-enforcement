import { FC, useState, useMemo, useEffect } from "react";
import { useLegislationSearchQuery } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { Legislation } from "@/generated/graphql";
import { LegislationTable } from "@/app/components/common/legislation-table";
import { indentByType, LegislationType } from "@/app/types/app/legislation";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { Button } from "react-bootstrap";
import { LegislationText } from "@/app/components/common/legislation-text";
import { toggleLoading } from "@/app/store/reducers/app";
import { useAppDispatch } from "@/app/hooks/hooks";

const UPDATE_LEGISLATION = gql`
  mutation UpdateLegislationConfiguration($input: [UpdateLegislationConfigurationInput!]!) {
    updateLegislationConfiguration(input: $input)
  }
`;

export const LegislationManagement: FC = () => {
  // Hooks
  const { legislationSourceGuid } = useParams<{ legislationSourceGuid: string }>();
  const [searchParams] = useSearchParams();
  const legislationAgency = searchParams.get("agencyCode") ?? "";
  const dispatch = useAppDispatch();

  const { data, isLoading } = useLegislationSearchQuery({
    agencyCode: legislationAgency,
    onlyActive: false,
    legislationTypeCodes: [], // Get all types now
    excludeRegulations: false,
    legislationSourceGuid: legislationSourceGuid,
    enabled: !!legislationSourceGuid,
  });

  const updateLegislation = useGraphQLMutation(UPDATE_LEGISLATION, {
    onSuccess: () => {
      ToggleSuccess("Legislation updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating legislation:", error);
      ToggleError("Failed to update legislation");
    },
  });

  // State
  const [contraventionNodes, setContraventionNodes] = useState<Set<string>>(new Set());
  const [originalContraventionNodes, setOriginalContraventionNodes] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([LegislationType.ACT])); // Start with act expanded

  // Data
  const userAgency = getUserAgency();

  const rootNode = useMemo(() => {
    return data?.legislations?.find((item) => item.parentGuid === null);
  }, [data]);

  const rootNodeTitle = rootNode?.sectionTitle || rootNode?.legislationText || "Legislation";
  const rootNodeGuid = rootNode?.legislationGuid;

  // Group legislation by source (Act vs individual Regulations)
  const groupedLegislation = useMemo(() => {
    if (!data?.legislations) {
      return { act: [], regulations: [] };
    }

    const sortByDisplayOrderAndCitation = (a: Legislation, b: Legislation) =>
      (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
      (Number.parseFloat(a.citation ?? "") || 9999) - (Number.parseFloat(b.citation ?? "") || 9999);

    const itemsByGuid = new Map(data.legislations.map((item) => [item.legislationGuid, item]));

    // Helper to check if item is descendant of a regulation
    const getRegulationAncestor = (item: Legislation): string | null => {
      let current = item;
      const visited = new Set<string>();

      while (current.parentGuid && !visited.has(current.parentGuid)) {
        visited.add(current.parentGuid);
        const parent = itemsByGuid.get(current.parentGuid);
        if (!parent) break;

        if (parent.legislationTypeCode === LegislationType.REGULATION) {
          return parent.legislationGuid!;
        }
        current = parent;
      }

      return null;
    };

    // Separate items by act vs regulations first
    const actItems: Legislation[] = [];
    const regItemsMap = new Map<string, Legislation[]>();
    const regulationHeaders = new Map<string, { title: string }>();

    data.legislations
      .filter((item) => item.legislationGuid !== rootNodeGuid)
      .forEach((item) => {
        if (!item.legislationGuid) return;
        if (item.legislationTypeCode === LegislationType.REGULATION) {
          regulationHeaders.set(item.legislationGuid, {
            title: item.sectionTitle || item.legislationText || "Regulation",
          });
          return;
        }

        const regAncestor = getRegulationAncestor(item);

        if (regAncestor) {
          if (!regItemsMap.has(regAncestor)) {
            regItemsMap.set(regAncestor, []);
          }
          regItemsMap.get(regAncestor)!.push(item);
        } else {
          actItems.push(item);
        }
      });

    // Now sort hierarchically
    const sortHierarchically = (items: Legislation[], rootParentGuid?: string) => {
      // Group by parent
      const childrenByParent = new Map<string, Legislation[]>();

      items.forEach((item) => {
        const parentKey = item.parentGuid || "ROOT";
        if (!childrenByParent.has(parentKey)) {
          childrenByParent.set(parentKey, []);
        }
        childrenByParent.get(parentKey)!.push(item);
      });

      // Sort each group
      childrenByParent.forEach((children) => {
        children.sort(sortByDisplayOrderAndCitation);
      });

      // Flatten recursively
      const flatten = (parentGuid: string = "ROOT"): Legislation[] => {
        const children = childrenByParent.get(parentGuid);
        if (!children) return [];

        const result: Legislation[] = [];

        for (const child of children) {
          // Add SECHEAD if SEC has both title and text
          // This is a fake type to provide formatting
          if (child.legislationTypeCode === LegislationType.SECTION && child.sectionTitle && child.legislationText) {
            result.push({
              displayOrder: child.displayOrder,
              citation: child.citation,
              legislationText: child.sectionTitle,
              legislationTypeCode: "SECHEAD",
              parentGuid: child.parentGuid,
              legislationGuid: `${child.legislationGuid}_header`,
            } as Legislation);
          }

          result.push(child);

          const childResults = flatten(child.legislationGuid ?? undefined);
          if (childResults.length > 0) {
            result.push(...childResults);
          }
        }

        return result;
      };

      return flatten(rootParentGuid);
    };

    const act = sortHierarchically(actItems, rootNodeGuid ?? undefined);

    const regulations = Array.from(regItemsMap.entries()).map(([guid, items]) => ({
      guid,
      title: regulationHeaders.get(guid)?.title || "Regulation",
      items: sortHierarchically(items, guid),
    }));

    return { act, regulations };
  }, [data, rootNodeGuid]);

  // Use Effects

  // Initialize tracking arrays
  useEffect(() => {
    if (data?.legislations) {
      const enabledNodes = new Set<string>();
      data.legislations.forEach((item) => {
        if (item.legislationGuid && item.isEnabled) {
          enabledNodes.add(item.legislationGuid);
        }
      });
      setContraventionNodes(enabledNodes);
      setOriginalContraventionNodes(new Set(enabledNodes)); // Save original state
    }
  }, [data]);

  // Helper function to get all descendants recursively
  const getAllDescendants = (parentGuid: string): string[] => {
    if (!data?.legislations) return [];

    const children = data.legislations.filter((item) => item.parentGuid === parentGuid);
    const descendants: string[] = [];

    for (const child of children) {
      if (!child.legislationGuid) continue;

      descendants.push(child.legislationGuid);
      const childDescendants = getAllDescendants(child.legislationGuid);
      descendants.push(...childDescendants);
    }

    return descendants;
  };

  // Helper function that enables/disables either a single node or the node + children (if it's a parent)
  const updateContraventionSet = (targetSet: Set<string>, guids: string[], checked: boolean) => {
    guids.forEach((guid) => {
      // Handle SECHEAD guids
      const actualGuid = getActualGuid(guid);

      // Update the item
      if (checked) {
        targetSet.add(actualGuid);
      } else {
        targetSet.delete(actualGuid);
      }

      // Update descendants
      getAllDescendants(actualGuid).forEach((descendantGuid) => {
        if (checked) {
          targetSet.add(descendantGuid);
        } else {
          targetSet.delete(descendantGuid);
        }
      });
    });
  };

  // Toggles a single item + descendants
  const handleToggleContravention = (guid: string, checked: boolean) => {
    setContraventionNodes((prev) => {
      const next = new Set(prev);
      updateContraventionSet(next, [guid], checked);
      return next;
    });
  };

  // Helper to check if an item has any enabled descendants
  const hasEnabledDescendants = (guid: string): boolean => {
    const descendants = getAllDescendants(guid);
    return descendants.some((d) => {
      const item = data?.legislations?.find((leg) => leg.legislationGuid === d);
      const isParent = [
        LegislationType.ACT,
        LegislationType.REGULATION,
        LegislationType.PART,
        LegislationType.DIVISION,
        LegislationType.SCHEDULE,
      ].includes(item?.legislationTypeCode as LegislationType);
      // Only count non-parent items
      return !isParent && contraventionNodes.has(d);
    });
  };

  // Toggles a single item + descendants
  const handleSave = async () => {
    dispatch(toggleLoading(true));
    // Force a render cycle so the spinner appears
    await new Promise((resolve) => setTimeout(resolve, 0));
    const changes: Array<{ legislationGuid: string; agencyCode: string; isEnabled: boolean }> = [];

    // Process all items
    data?.legislations?.forEach((item) => {
      if (!item.legislationGuid) return;

      const baseParentTypes = [
        LegislationType.ACT,
        LegislationType.REGULATION,
        LegislationType.PART,
        LegislationType.DIVISION,
        LegislationType.SCHEDULE,
      ];
      let isParentType = baseParentTypes.includes(item.legislationTypeCode as LegislationType);

      // For SEC, check if it actually has children
      if (item.legislationTypeCode === LegislationType.SECTION) {
        const descendants = getAllDescendants(item.legislationGuid);
        isParentType = descendants.length > 0;
      }

      let shouldBeEnabled: boolean;

      if (isParentType) {
        // Parent types: enabled if ANY descendants are enabled
        shouldBeEnabled = hasEnabledDescendants(item.legislationGuid);
      } else {
        // Leaf items: enabled if in the set
        shouldBeEnabled = contraventionNodes.has(item.legislationGuid);
      }

      const wasEnabled = originalContraventionNodes.has(item.legislationGuid);

      // Only add to changes if state changed
      if (shouldBeEnabled !== wasEnabled) {
        changes.push({
          legislationGuid: item.legislationGuid,
          agencyCode: legislationAgency,
          isEnabled: shouldBeEnabled,
        });
      }
    });

    updateLegislation.mutateAsync({ input: changes });
    dispatch(toggleLoading(false));
  };

  // Toggles all items in an Act or Regulation
  const toggleAllChecksInSection = async (sectionId: string, checked: boolean, recursive: boolean) => {
    dispatch(toggleLoading(true));
    // Force a render cycle so the spinner appears
    await new Promise((resolve) => setTimeout(resolve, 0));
    setContraventionNodes((prev) => {
      const next = new Set(prev);

      let itemsToToggle;

      if (sectionId === LegislationType.ACT) {
        itemsToToggle = recursive
          ? [...groupedLegislation.act, ...groupedLegislation.regulations.flatMap((r) => r.items)]
          : groupedLegislation.act;
      } else {
        itemsToToggle = groupedLegislation.regulations.find((r) => r.guid === sectionId)?.items || [];
      }
      const guids = itemsToToggle.map((item) => item.legislationGuid).filter((guid): guid is string => !!guid);

      updateContraventionSet(next, guids, checked);
      return next;
    });
    dispatch(toggleLoading(false));
  };

  // Expands or collapses Acts or Regulations
  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const getActualGuid = (guid: string) => guid.replace("_header", "");

  // Helper function that determines if an Act or Regulation is enabled
  const areAllEnabled = (sectionId: string, recursive: boolean): boolean => {
    if (sectionId === LegislationType.ACT) {
      // Check act items
      const allActEnabled = groupedLegislation.act.every((item) => {
        if (!item.legislationGuid) return true;
        const actualGuid = item.legislationGuid.replace("_header", "");
        return contraventionNodes.has(actualGuid);
      });

      let allRegsEnabled = true;
      if (recursive) {
        // Check all regulations
        allRegsEnabled = groupedLegislation.regulations.every((reg) =>
          reg.items.every((item) => {
            if (!item.legislationGuid) return true;
            const actualGuid = item.legislationGuid.replace("_header", "");
            return contraventionNodes.has(actualGuid);
          }),
        );
      }
      return allActEnabled && allRegsEnabled;
    } else {
      // Check specific regulation
      const reg = groupedLegislation.regulations.find((r) => r.guid === sectionId);
      if (!reg) return false;
      return reg.items.every((item) => {
        if (!item.legislationGuid) return true;
        const actualGuid = item.legislationGuid.replace("_header", "");
        return contraventionNodes.has(actualGuid);
      });
    }
  };

  // Helper function that renders a legislation row
  const renderSectionRow = (section: Legislation) => {
    const indentClass = indentByType[section.legislationTypeCode as keyof typeof indentByType] || "ms-0";

    // For SECHEAD, check if the actual SEC is checked
    let checkGuid = section.legislationGuid!;
    if (section.legislationTypeCode === "SECHEAD" && checkGuid.endsWith("_header")) {
      checkGuid = checkGuid.replace("_header", "");
    }

    const isChecked = contraventionNodes.has(checkGuid);

    // This helper wraps the row layout (checkbox + content)
    const baseWrapper = (content: React.ReactNode) => (
      <div
        key={section.legislationGuid}
        className="d-flex align-items-start py-2 border-bottom"
      >
        <div className="d-flex justify-content-center leg-admin-checkbox-column">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isChecked}
            onChange={(e) => handleToggleContravention(section.legislationGuid!, e.target.checked)}
          />
        </div>

        <div>{content}</div>
      </div>
    );

    if (
      section.legislationTypeCode === LegislationType.SCHEDULE ||
      section.legislationTypeCode === LegislationType.DIVISION ||
      section.legislationTypeCode === LegislationType.PART
    ) {
      let typeLabel = "Part";
      if (section.legislationTypeCode === LegislationType.SCHEDULE) {
        typeLabel = "Schedule";
      } else if (section.legislationTypeCode === LegislationType.DIVISION) {
        typeLabel = "Division";
      }

      return baseWrapper(
        <p className={`mb-2 ${indentClass}`}>
          <strong>
            {typeLabel} {section.citation} {section.sectionTitle}
          </strong>
        </p>,
      );
    }

    if (section.legislationTypeCode === LegislationType.TEXT) {
      return baseWrapper(
        <p className={`mb-2 ${indentClass}`}>
          <LegislationText>{section.legislationText}</LegislationText>
        </p>,
      );
    }

    if (section.legislationTypeCode === LegislationType.TABLE && section.legislationText) {
      return baseWrapper(
        <div className={indentClass}>
          <LegislationTable html={section.legislationText} />
        </div>,
      );
    }

    if (section.legislationTypeCode === LegislationType.SECTION) {
      if (section.legislationText) {
        // SEC with text - just show the text (header was already shown via SECHEAD)
        return baseWrapper(
          <p className={`mb-2 ${indentClass}`}>
            <LegislationText>{section.legislationText}</LegislationText>
          </p>,
        );
      } else {
        // SEC with only title - show as header
        return baseWrapper(
          <p className={`mb-2 ${indentClass}`}>
            <strong>
              {section.citation} {section.sectionTitle}
            </strong>
          </p>,
        );
      }
    }

    const displayCitation =
      section.citation || (section.legislationTypeCode === LegislationType.SUBSECTION ? "1" : null);

    return baseWrapper(
      <p className={`mb-2 ${indentClass}`}>
        {section.legislationTypeCode === "SECHEAD" ? (
          <strong>
            {section.citation} <LegislationText>{section.legislationText}</LegislationText>
          </strong>
        ) : (
          <>
            {section.legislationTypeCode !== LegislationType.SECTION && displayCitation && <>({displayCitation}) </>}
            <LegislationText>{section.legislationText || section.sectionTitle}</LegislationText>
          </>
        )}
      </p>,
    );
  };

  // Guard to prevent someone from changing the URL parameter
  if (userAgency !== legislationAgency) {
    return <Navigate to="/not-authorized" />;
  }

  return (
    <div className="comp-main-content">
      <div className="comp-complaint-details">
        <div className="comp-details-header">
          <div className="comp-container">
            <div className="comp-complaint-breadcrumb">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item comp-nav-item-name-inverted">
                    <Link to={`/admin/laws`}>Manage legislation</Link>
                  </li>
                  <li
                    className="breadcrumb-item"
                    aria-current="page"
                  >
                    Configure legislation
                  </li>
                </ol>
              </nav>
            </div>
            <div className="comp-header-actions">
              <Button
                id="details-screen-update-status-button"
                title="Update status"
                variant="outline-light"
                onClick={handleSave}
              >
                <i className="bi bi-check-circle"></i>
                <span>Save</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="comp-container">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {/* Act Table */}
              <div className="mb-5">
                <div className="d-flex align-items-center mb-2 flex-nowrap gap-3">
                  <Button
                    onClick={() => toggleSection(LegislationType.ACT)}
                    className="btn btn-link h3 leg-admin-title"
                  >
                    <h3 className="d-flex align-items-center mb-0">
                      <i
                        className={`bi bi-chevron-${expandedSections.has(LegislationType.ACT) ? "down" : "right"} me-2`}
                      ></i>
                      {rootNodeTitle}
                    </h3>
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      toggleAllChecksInSection(LegislationType.ACT, !areAllEnabled(LegislationType.ACT, false), false)
                    }
                  >
                    {areAllEnabled(LegislationType.ACT, false) ? "Disable all (act only)" : "Enable all (act only)"}
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() =>
                      toggleAllChecksInSection(LegislationType.ACT, !areAllEnabled(LegislationType.ACT, true), true)
                    }
                  >
                    {areAllEnabled(LegislationType.ACT, true)
                      ? "Disable all (acts and regs)"
                      : "Enable all (acts and regs)"}
                  </Button>
                </div>

                {expandedSections.has(LegislationType.ACT) && (
                  <>
                    {/* Header row */}
                    <div className="d-flex align-items-center mb-2 fw-bold border-bottom pb-2">
                      <div className="leg-admin-checkbox-column">Enabled</div>
                    </div>

                    <div className="legislation-list">{groupedLegislation.act.map(renderSectionRow)}</div>
                  </>
                )}
              </div>

              {/* Regulation Tables */}
              {groupedLegislation.regulations
                .toSorted((a, b) => a.title.localeCompare(b.title))
                .map((reg) => (
                  <div
                    key={reg.guid}
                    className="mb-5"
                  >
                    <div className="d-flex align-items-center mb-2 flex-nowrap gap-3">
                      <Button
                        onClick={() => toggleSection(reg.guid)}
                        className="btn btn-link h3 leg-admin-title"
                      >
                        <h3 className="d-flex align-items-center mb-0">
                          <i className={`bi bi-chevron-${expandedSections.has(reg.guid) ? "down" : "right"} me-2`}></i>
                          {reg.title}
                        </h3>
                      </Button>

                      <Button
                        variant="outline-primary"
                        onClick={() => toggleAllChecksInSection(reg.guid, !areAllEnabled(reg.guid, true), false)}
                      >
                        {areAllEnabled(reg.guid, true) ? "Disable All" : "Enable All"}
                      </Button>
                    </div>
                    {expandedSections.has(reg.guid) && (
                      <>
                        {/* Header row */}
                        <div className="d-flex align-items-center mb-2 fw-bold border-bottom pb-2">
                          <div style={{ width: "60px", textAlign: "center" }}>Enabled</div>
                        </div>

                        <div className="legislation-list">{reg.items.map(renderSectionRow)}</div>
                      </>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

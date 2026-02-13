import { FC, useState, useMemo, useEffect } from "react";
import { useLegislationSearchQuery } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { Legislation } from "@/generated/graphql";
import { LegislationTable } from "@/app/components/common/legislation-table";
import { indentByType } from "@/app/types/app/legislation";
import { Link, useParams } from "react-router-dom";
import { gql } from "graphql-request";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { Button } from "react-bootstrap";
import { LegislationText } from "@/app/components/common/legislation-text";

const UPDATE_LEGISLATION = gql`
  mutation UpdateLegislationConfiguration($input: [UpdateLegislationConfigurationInput!]!) {
    updateLegislationConfiguration(input: $input)
  }
`;

export const LegislationManagement: FC = () => {
  const userAgency = getUserAgency();

  const { legislationSourceGuid } = useParams<{ legislationSourceGuid: string }>();

  const { data, isLoading } = useLegislationSearchQuery({
    agencyCode: userAgency,
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
      ToggleError(error.response.errors[0].extensions.originalError ?? "Failed to update legislation");
    },
  });

  const [contraventionNodes, setContraventionNodes] = useState<Set<string>>(new Set());
  const [originalContraventionNodes, setOriginalContraventionNodes] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["act"])); // Start with act expanded

  // Get the root node
  const rootNode = useMemo(() => {
    return data?.legislations?.find((item) => item.parentGuid === null);
  }, [data]);

  const rootNodeTitle = rootNode?.sectionTitle || rootNode?.legislationText || "Legislation";
  const rootNodeGuid = rootNode?.legislationGuid;

  // Group legislation by source (Act vs individual Regulations)
  const groupedLegislation = useMemo(() => {
    if (!data?.legislations) return { act: [], regulations: [] };

    const sortByDisplayOrderAndCitation = (a: Legislation, b: Legislation) =>
      (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) ||
      (Number.parseFloat(a.citation ?? "") || 9999) - (Number.parseFloat(b.citation ?? "") || 9999);

    // Helper to check if item is descendant of a regulation
    const getRegulationAncestor = (item: Legislation): string | null => {
      let current = item;
      const visited = new Set<string>();

      while (current.parentGuid && !visited.has(current.parentGuid)) {
        visited.add(current.parentGuid);
        const parent = data.legislations.find((l) => l.legislationGuid === current.parentGuid);
        if (!parent) break;

        if (parent.legislationTypeCode === "REG") {
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
        if (item.legislationTypeCode === "REG") {
          regulationHeaders.set(item.legislationGuid!, {
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

    // Now sort hierarchically for act
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
        const children = childrenByParent.get(parentGuid) || [];

        return children.flatMap((child) => {
          const result: Legislation[] = [];

          // Add SECHEAD if SEC has both title and text
          if (child.legislationTypeCode === "SEC" && child.sectionTitle && child.legislationText) {
            result.push({
              displayOrder: child.displayOrder,
              citation: child.citation,
              legislationText: child.sectionTitle,
              legislationTypeCode: "SECHEAD",
              parentGuid: child.parentGuid,
              legislationGuid: `${child.legislationGuid}_header`,
            } as Legislation);
          }

          return [...result, child, ...flatten(child.legislationGuid ?? undefined)];
        });
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

  // Toggles a single item + descendants
  const handleSave = () => {
    const changes: Array<{ legislationGuid: string; agencyCode: string; isEnabled: boolean }> = [];

    // Find items that are now enabled but weren't originally
    contraventionNodes.forEach((guid) => {
      if (!originalContraventionNodes.has(guid)) {
        changes.push({ legislationGuid: guid, agencyCode: userAgency, isEnabled: true });
      }
    });

    // Find items that were enabled but aren't now
    originalContraventionNodes.forEach((guid) => {
      if (!contraventionNodes.has(guid)) {
        changes.push({ legislationGuid: guid, agencyCode: userAgency, isEnabled: false });
      }
    });

    updateLegislation.mutateAsync({ input: changes });
  };

  // Toggles all items in an Act or Regulation
  const toggleAllChecksInSection = (sectionId: string, checked: boolean, recursive: boolean) => {
    setContraventionNodes((prev) => {
      const next = new Set(prev);

      let itemsToToggle;

      if (sectionId === "act") {
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
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
    if (sectionId === "act") {
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
        <div
          style={{ width: "60px", flexShrink: 0 }}
          className="d-flex justify-content-center"
        >
          <input
            type="checkbox"
            className="form-check-input"
            checked={isChecked}
            onChange={(e) => handleToggleContravention(section.legislationGuid!, e.target.checked)}
          />
        </div>

        <div style={{ flex: 1 }}>{content}</div>
      </div>
    );

    if (
      section.legislationTypeCode === "SCHED" ||
      section.legislationTypeCode === "DIV" ||
      section.legislationTypeCode === "PART"
    ) {
      return baseWrapper(
        <p className={`mb-2 ${indentClass}`}>
          <strong>
            Part {section.citation} {section.sectionTitle}
          </strong>
        </p>,
      );
    }

    if (section.legislationTypeCode === "TEXT") {
      return baseWrapper(
        <p className={`mb-2 ${indentClass}`}>
          <LegislationText>{section.legislationText}</LegislationText>
        </p>,
      );
    }

    if (section.legislationTypeCode === "TABLE" && section.legislationText) {
      return baseWrapper(
        <div className={indentClass}>
          <LegislationTable html={section.legislationText} />
        </div>,
      );
    }

    if (section.legislationTypeCode === "SEC") {
      if (section.legislationText) {
        // SEC with text - just show the text (header was already shown via SECHEAD)
        return baseWrapper(<p className={`mb-2 ${indentClass}`}>{section.legislationText}</p>);
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

    const displayCitation = section.citation || (section.legislationTypeCode === "SUBSEC" ? "1" : null);

    return baseWrapper(
      <p className={`mb-2 ${indentClass}`}>
        {section.legislationTypeCode === "SECHEAD" ? (
          <strong>
            {section.citation} {section.legislationText}
          </strong>
        ) : (
          <>
            {section.legislationTypeCode !== "SEC" && displayCitation && <>({displayCitation}) </>}
            {section.legislationText || section.sectionTitle}
          </>
        )}
      </p>,
    );
  };

  return (
    <div className="comp-main-content">
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
        {/* Act Table */}
        <div className="mb-5">
          <div className="d-flex align-items-center mb-2 flex-nowrap gap-3">
            <button
              onClick={() => toggleSection("act")}
              className="btn btn-link text-decoration-none p-0 text-start h3"
              style={{ border: "none", background: "none", color: "inherit" }}
            >
              <h3 className="d-flex align-items-center mb-0">
                <i className={`bi bi-chevron-${expandedSections.has("act") ? "down" : "right"} me-2`}></i>
                {rootNodeTitle}
              </h3>
            </button>
            <button
              className="btn btn-sm btn-outline-primary flex-shrink-0"
              onClick={() => toggleAllChecksInSection("act", !areAllEnabled("act", false), false)}
            >
              {areAllEnabled("act", false) ? "Disable all (act only)" : "Enable all (act only)"}
            </button>
            <button
              className="btn btn-sm btn-outline-primary flex-shrink-0"
              onClick={() => toggleAllChecksInSection("act", !areAllEnabled("act", true), true)}
            >
              {areAllEnabled("act", true) ? "Disable all (acts and regs)" : "Enable all (acts and regs)"}
            </button>
          </div>

          {expandedSections.has("act") && (
            <>
              {/* Header row */}
              <div className="d-flex align-items-center mb-2 fw-bold border-bottom pb-2">
                <div style={{ width: "60px", textAlign: "center" }}>Enabled</div>
              </div>

              <div className="legislation-list">{groupedLegislation.act.map(renderSectionRow)}</div>
            </>
          )}
        </div>

        {/* Regulation Tables */}
        {groupedLegislation.regulations.map((reg) => (
          <div
            key={reg.guid}
            className="mb-5"
          >
            <div className="d-flex align-items-center mb-2 flex-nowrap gap-3">
              <button
                onClick={() => toggleSection(reg.guid)}
                className="btn btn-link text-decoration-none p-0 text-start h3"
                style={{ border: "none", background: "none", color: "inherit" }}
              >
                <h3 className="d-flex align-items-center mb-0">
                  <i className={`bi bi-chevron-${expandedSections.has(reg.guid) ? "down" : "right"} me-2`}></i>
                  {reg.title}
                </h3>
              </button>

              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => toggleAllChecksInSection(reg.guid, !areAllEnabled(reg.guid, true), false)}
              >
                {areAllEnabled(reg.guid, true) ? "Disable All" : "Enable All"}
              </button>
            </div>
            {expandedSections.has(reg.guid) && (
              <>
                {/* Header row */}
                <div className="d-flex align-items-center mb-2 fw-bold border-bottom pb-2">
                  <div style={{ width: "60px", textAlign: "center" }}>Enabled</div>
                  <div style={{ flex: 1, paddingLeft: "10px" }}>Legislation</div>
                </div>

                <div className="legislation-list">{reg.items.map(renderSectionRow)}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

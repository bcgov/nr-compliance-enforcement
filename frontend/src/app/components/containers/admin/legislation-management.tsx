import { FC, useState, useMemo } from "react";
import { useLegislationSearchQuery } from "@/app/graphql/hooks/useLegislationSearchQuery";
import { getUserAgency } from "@/app/service/user-service";
import { Legislation } from "@/generated/graphql";
import { LegislationTable } from "@/app/components/common/legislation-table";
import { indentByType } from "@/app/types/app/legislation";

export const LegislationManagement: FC = () => {
  const userAgency = getUserAgency();

  // TODO: This will eventually come from fetching the root node
  const rootNodeGuid = "680e499e-8c22-4ceb-b911-733bebe15399";
  const rootNodeTitle = "Land Act";

  const { data, isLoading } = useLegislationSearchQuery({
    agencyCode: userAgency,
    legislationTypeCodes: [], // Get all types now
    ancestorGuid: rootNodeGuid,
    excludeRegulations: false,
    enabled: !!rootNodeGuid,
  });

  const [contraventionNodes, setContraventionNodes] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["act"])); // Start with act expanded

  // Group legislation by source (Act vs individual Regulations)
  const groupedLegislation = useMemo(() => {
    if (!data?.legislations) return { act: [], regulations: [] };

    const act: Legislation[] = [];
    const regulationMap = new Map<string, { title: string; items: Legislation[] }>();

    // Helper function to check if an item is a descendant of a regulation
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

    const createSectionHeader = (item: Legislation): Legislation =>
      ({
        displayOrder: item.displayOrder,
        citation: item.citation,
        legislationText: item.sectionTitle,
        legislationTypeCode: "SECHEAD",
        parentGuid: item.parentGuid,
        legislationGuid: `${item.legislationGuid}_header`,
      }) as Legislation;

    const shouldAddItem = (item: Legislation): boolean => {
      return !!(item.legislationText || item.legislationTypeCode !== "SEC");
    };

    const addItemToRegulation = (item: Legislation, reg: { title: string; items: Legislation[] }) => {
      if (item.legislationTypeCode === "SEC") {
        reg.items.push(createSectionHeader(item));
      }
      if (shouldAddItem(item)) {
        reg.items.push(item);
      }
    };

    const addItemToAct = (item: Legislation, act: Legislation[]) => {
      if (item.legislationTypeCode === "SEC") {
        act.push(createSectionHeader(item));
      }
      if (shouldAddItem(item)) {
        act.push(item);
      }
    };

    data.legislations
      .filter((item) => item.legislationGuid !== rootNodeGuid)
      .forEach((item) => {
        if (item.legislationTypeCode === "REG") {
          if (!regulationMap.has(item.legislationGuid!)) {
            regulationMap.set(item.legislationGuid!, {
              title: item.sectionTitle || item.legislationText || "Regulation",
              items: [],
            });
          }
          return;
        }

        const regAncestor = getRegulationAncestor(item);

        if (regAncestor) {
          const reg = regulationMap.get(regAncestor);
          if (reg) {
            addItemToRegulation(item, reg);
          }
        } else {
          addItemToAct(item, act);
        }
      });

    return {
      act,
      regulations: Array.from(regulationMap.entries()).map(([guid, data]) => ({
        guid,
        ...data,
      })),
    };
  }, [data, rootNodeGuid]);

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

  // Toggles all items in an Act or Regulation
  const toggleAllInSection = (sectionId: string, checked: boolean) => {
    setContraventionNodes((prev) => {
      const next = new Set(prev);

      const itemsToToggle =
        sectionId === "act"
          ? [...groupedLegislation.act, ...groupedLegislation.regulations.flatMap((r) => r.items)]
          : groupedLegislation.regulations.find((r) => r.guid === sectionId)?.items || [];

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
  const areAllEnabled = (sectionId: string): boolean => {
    if (sectionId === "act") {
      // Check act items
      const allActEnabled = groupedLegislation.act.every((item) => {
        if (!item.legislationGuid) return true;
        const actualGuid = item.legislationGuid.replace("_header", "");
        return contraventionNodes.has(actualGuid);
      });

      // Check all regulations
      const allRegsEnabled = groupedLegislation.regulations.every((reg) =>
        reg.items.every((item) => {
          if (!item.legislationGuid) return true;
          const actualGuid = item.legislationGuid.replace("_header", "");
          return contraventionNodes.has(actualGuid);
        }),
      );

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
      return baseWrapper(<p className={`mb-2 ${indentClass}`}>{section.legislationText}</p>);
    }

    if (section.legislationTypeCode === "TABLE" && section.legislationText) {
      return baseWrapper(
        <div className={indentClass}>
          <LegislationTable html={section.legislationText} />
        </div>,
      );
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
    <div className="comp-page-container">
      <div className="comp-page-header">
        <div className="comp-page-title-container">
          <h1>Configure legislation</h1>
        </div>
      </div>

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
            onClick={() => toggleAllInSection("act", !areAllEnabled("act"))}
          >
            {areAllEnabled("act") ? "Disable All" : "Enable All"}
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
              onClick={() => toggleAllInSection(reg.guid, !areAllEnabled(reg.guid))}
            >
              {areAllEnabled(reg.guid) ? "Disable All" : "Enable All"}
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
  );
};

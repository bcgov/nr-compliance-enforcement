import React, { FC, ComponentType, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

interface ActivityColumnProps {
  title: string;
  items?: any[];
  ItemComponent?: ComponentType<any>;
  addButtonText: string;
  isLoading?: boolean;
  loadingText?: string;
  disableBorder?: boolean;
  onAddClick?: () => void;
  keyProperty?: string;
  caseName?: string;
  caseIdentifier?: string;
}

export const ActivityColumn: FC<ActivityColumnProps> = ({
  title,
  items = [],
  ItemComponent,
  addButtonText,
  isLoading = false,
  loadingText = "Loading...",
  disableBorder = false,
  onAddClick,
  keyProperty = "id",
  caseName,
  caseIdentifier,
}) => {
  const [showBorder, setShowBorder] = useState(true);

  // Check if the screen size will cause the three columns to be stacked, if so, don't show the border
  useEffect(() => {
    const checkScreenSize = () => {
      const mediaQuery = window.matchMedia("(min-width: 992px)");
      setShowBorder(mediaQuery.matches);
    };

    checkScreenSize();
    const mediaQuery = window.matchMedia("(min-width: 992px)");
    const listener = (e: MediaQueryListEvent) => setShowBorder(e.matches);
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return (
    <div className="col-lg-4 d-flex flex-column">
      <div className={`flex-grow-1 ${showBorder && !disableBorder ? "pe-3 border-end" : ""}`}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">{title}</h5>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={onAddClick}
          >
            <i className="bi bi-plus-circle me-1" />
            {addButtonText}
          </Button>
        </div>
        {isLoading ? (
          <div className="border rounded p-3 mb-3 bg-white">
            <p className="mb-0">{loadingText}</p>
          </div>
        ) : (
          ItemComponent &&
          items.map((item) => (
            <ItemComponent
              key={item[keyProperty]}
              item={item}
              caseName={caseName}
              caseIdentifier={caseIdentifier}
            />
          ))
        )}
      </div>
    </div>
  );
};

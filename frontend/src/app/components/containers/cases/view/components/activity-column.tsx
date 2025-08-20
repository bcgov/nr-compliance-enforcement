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
}) => {
  const [showBorder, setShowBorder] = useState(true);

  // Check if the screen size will cause the four columns to be stacked, if so, don't show the border
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
    <div className="col-lg-3 d-flex flex-column">
      <h5 className="fw-bold mb-3">{title}</h5>
      <div className={`flex-grow-1 ${showBorder && !disableBorder ? "pe-3 border-end" : ""}`}>
        {isLoading ? (
          <div className="border rounded p-3 mb-3 bg-white">
            <p className="mb-0">{loadingText}</p>
          </div>
        ) : (
          ItemComponent &&
          items.map((item, index) => (
            <ItemComponent
              key={index}
              item={item}
            />
          ))
        )}
        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={onAddClick}
        >
          <i className="bi bi-plus-circle" />
          <span>{addButtonText}</span>
        </Button>
      </div>
    </div>
  );
};

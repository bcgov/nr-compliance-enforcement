import { FC } from "react";
import { Dropdown } from "react-bootstrap";

export const ActionMenu: FC = () => {
  return (
    <div className="comp-header-actions">
      <div className="comp-header-actions-mobile">
        <Dropdown>
          <Dropdown.Toggle
            aria-label="Actions Menu"
            variant="outline-primary"
            className="icon-btn"
            id="dropdown-basic"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item
              as="button"
              disabled={true}
            >
              <i className="bi bi-gear"></i>
              <span>Placeholder Action</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="comp-header-actions-desktop">
        <Dropdown className="comp-header-kebab-menu">
          <Dropdown.Toggle
            aria-label="Actions Menu"
            variant="outline-light"
            className="kebab-btn"
            id="dropdown-basic"
          >
            <i className="bi bi-three-dots-vertical"></i>
            <span>More actions</span>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item
              as="button"
              disabled={true}
            >
              <i className="bi bi-gear"></i>
              <span>Placeholder Action</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

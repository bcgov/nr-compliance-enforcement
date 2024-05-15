import { FC } from "react";
import { Button } from "react-bootstrap";

interface Props {
  id: string;
  label?: string;
  name: string;
  clear: (name: string) => void;
}

export const FilterButton: FC<Props> = ({ id, label, name, clear }) => {
  const handleComplaintClick = (
    e: any, //-- this needs to be updated to use the correct type when updating <Row> to <tr>
    id: string,
  ) => {
    e.preventDefault();
    clear(name);
  };

  return (
    <Button
      variant="primary"
      size="sm"
      className="filter-pill active"
      id={id}
      onClick={(evt) => handleComplaintClick(evt, "moo")}
    >
      <span>{label}</span>
      <i className="bi bi-x"></i>
    </Button>
  );
};

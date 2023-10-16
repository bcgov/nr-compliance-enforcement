import { FC } from "react";

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
    <button
      type="button"
      className="btn btn-primary comp-filter-btn comp-filter-pill"
      id={id}
      onClick={(evt) => handleComplaintClick(evt, "moo")}
    >
      {label}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-x"
        viewBox="0 0 16 16"
        aria-label="Close"
      >
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
      </svg>
    </button>
  );
};

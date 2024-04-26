import { FC } from "react";

type props = {
  classNames?: string;
  children: React.ReactNode;
  onClick: Function;
};

export const CompIconButton: FC<props> = ({ classNames, children, onClick }) => {
  const handleClickEvent = () => {
    onClick();
  };

  const renderClassNames = () => {
    let results = "comp-icon-button-container";

    if (classNames) {
      results = `${results} ${classNames}`;
    }

    return results;
  };

  return (
    <button
      className={renderClassNames()}
      onClick={() => handleClickEvent()}
    >
      {children}
    </button>
  );
};

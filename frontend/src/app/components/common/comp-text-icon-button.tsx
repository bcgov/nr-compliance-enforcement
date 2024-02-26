import { FC, MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  id?: string;
  buttonClasses?: string;
  text: string;
  icon: IconType;
  click: MouseEventHandler;
};

export const CompTextIconButton: FC<Props> = ({ id, buttonClasses, text, icon, click }) => {
  const Icon = icon;

  return (
    <button id={id} className={buttonClasses} onClick={click}>
      <span>{text}</span>
      <Icon />
    </button>
  );
};

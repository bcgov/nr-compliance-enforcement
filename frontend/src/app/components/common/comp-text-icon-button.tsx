import { FC, MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  id?: string;
  buttonClasses?: string;
  text: string;
  icon: IconType;
  click: MouseEventHandler;
  [index: string]: any;
};

export const CompTextIconButton: FC<Props> = ({ id, buttonClasses, text, icon, click, ...rest }) => {
  const Icon = icon;

  return (
    <button id={id} className={buttonClasses} onClick={click} {...rest}>
      <span>{text}</span>
      <Icon />
    </button>
  );
};

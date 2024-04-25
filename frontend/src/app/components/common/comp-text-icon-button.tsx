import { FC, MouseEventHandler } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  id?: string;
  buttonClasses?: string;
  text: string;
  icon: IconType;
  click: MouseEventHandler;
  [index: string]: any;
  isDisabled?: boolean;
};

export const CompTextIconButton: FC<Props> = ({ id, buttonClasses, text, icon, click, isDisabled, ...rest }) => {
  const Icon = icon;

  return (
    <button
      id={id}
      className={buttonClasses}
      onClick={click}
      {...rest}
      disabled={isDisabled ?? false}
    >
      <span>{text}</span>
      <Icon />
    </button>
  );
};

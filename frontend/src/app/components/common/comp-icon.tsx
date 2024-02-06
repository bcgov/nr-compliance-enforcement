import { FC } from "react";
import { BsXCircle, BsFillXCircleFill } from "react-icons/bs";

type props = {};

export const CompIcon: FC<props> = ({}) => {
  return (
    <div className="icon-container">
      <BsXCircle size={24}/>
      <BsFillXCircleFill size={24}/>
    </div>
  );
};

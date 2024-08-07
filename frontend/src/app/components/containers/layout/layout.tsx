import { FC } from "react";
import { SideBar, Header } from "./";

type Props = {
  children: React.ReactNode;
  fixedSidebar?: boolean;
  fixedHeader?: boolean;
};

export const Layout: FC<Props> = ({ fixedSidebar, fixedHeader, children }) => {
  const generateContainerClasses = () => {
    if (fixedHeader && !fixedSidebar) {
      return "comp-app-container fixed-header";
    } else if (!fixedHeader && fixedSidebar) {
      return "comp-app-container fixed-sidebar";
    } else if (fixedHeader && fixedSidebar) {
      return "comp-app-container fixed-header fixed-sidebar";
    } else {
      return "comp-app-container";
    }
  };

  return (
    <div className={generateContainerClasses()}>
      <Header />
      <div className="comp-body-container">
        <SideBar />
        <div className="comp-main-content">{children}</div>
      </div>
    </div>
  );
};

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
      return "comp-container fixed-header";
    } else if (!fixedHeader && fixedSidebar) {
      return "comp-container fixed-sidebar";
    } else if (fixedHeader && fixedSidebar) {
      return "comp-container fixed-header fixed-sidebar";
    } else {
      return "comp-container";
    }
  };

  return (
    <div className={generateContainerClasses()}>
      <Header />
      <div className="comp-container-inner">
        <SideBar />
        <div
          role="main"
          className="comp-main"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

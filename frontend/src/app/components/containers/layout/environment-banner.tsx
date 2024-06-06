import React, { FC } from "react";

interface Props {
  environmentName: string;
}

const EnvironmentBanner: FC<Props> = ({ environmentName }) => {
  return (
    <div className="environment-banner">
      This is a {environmentName} environment: data entered here will not transfer to the LIVE application.
    </div>
  );
};

export default EnvironmentBanner;

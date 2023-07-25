import { FC } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { isLoading } from "../../store/reducers/app";
import { Spinner } from "react-bootstrap";

export const PageLoader: FC = () => {
  const loading: boolean = useAppSelector(isLoading);

  return (
    <div className="comp-loader-overlay" hidden={!loading}>
      <div className="comp-overlay-content d-flex align-items-center justify-content-center">
        <Spinner animation="grow" role="loading" />
      </div>
    </div>
  );
};

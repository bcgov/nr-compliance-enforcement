import { FC } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { isLoading } from '../../store/reducers/app';
import { Spinner } from "react-bootstrap";

export const PageLoader: FC = () => {
  const loading = useAppSelector(isLoading);
  const { isLoading: loadingState } = loading;

  return (
    <div className="comp-loader-overlay" hidden={!loadingState}>
      <div className="comp-overlay-content d-flex align-items-center justify-content-center">
        <Spinner animation="border" role="loading" />
      </div>
    </div>
  );
};

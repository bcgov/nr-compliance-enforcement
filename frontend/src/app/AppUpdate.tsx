import { FC, useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

const AppUpdateToast: FC = (): JSX.Element => (
  <>
    <h5 className="fw-bold mb-3 text-black">
      <span aria-label="sparkles">✨</span> Update Available
    </h5>
    <p className="text-black">A new version of NatComplaints is available. Click the button below to update.</p>
    <div>
      <Button
        variant="primary"
        onClick={() => window.location.reload()}
        className="block w-100"
      >
        Update
      </Button>
    </div>
  </>
);

const getManifestVersion = () =>
  fetch("/manifest.json", { cache: "no-cache" })
    .then((response) => response.json())
    .then((manifest) => manifest?.version);

export const AppUpdate: FC = (): JSX.Element => {
  const [manifestVersion, setManifestVersion] = useState();
  const [updating, setUpdating] = useState(false);
  const checkManifest = useCallback(
    () =>
      !updating &&
      getManifestVersion().then((currentManifestVersion) => {
        if (!manifestVersion) {
          setManifestVersion(currentManifestVersion);
        } else if (currentManifestVersion !== manifestVersion) {
          toast(<AppUpdateToast />, {
            className: "app-update-toast",
            hideProgressBar: true,
            autoClose: false,
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
            closeButton: false,
          });
          setUpdating(true);
        }
      }),
    [updating, manifestVersion],
  );
  useEffect(() => {
    checkManifest();
    const interval = setInterval(() => checkManifest(), 30000);
    return () => {
      clearInterval(interval);
    };
  }, [checkManifest, manifestVersion, updating]);
  return <></>;
};

import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { generateApiParameters, get } from "@common/api";
import config from "@/config";

export const InvestigationsAtAGlance: FC = () => {
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/metabase/investigations-at-a-glance`);
    get<string>(dispatch, parameters).then(setUrl);
  }, [dispatch]);

  return (
    <div className="comp-page-container">
      <div className="comp-page-title-container">
        <h1 className="mb-4">Investigations at a glance</h1>
      </div>
      {url && (
        <div className="comp-investigations-at-a-glance">
          <iframe
            src={url}
            title="Investigations at a glance"
          />
        </div>
      )}
    </div>
  );
};

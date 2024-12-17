import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { ToastContainer } from "react-toastify";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { Table } from "react-bootstrap";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";

export const FeatureManagement: FC = () => {
  const dispatch = useAppDispatch();

  const [featureData, setFeatureData] = useState<any[]>([]);

  const updateFeatureFlag = async (id: string, active_ind: boolean) => {
    try {
      const update = {
        feature_agency_xref_guid: id,
        active_ind: active_ind,
      };
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/feature-flag/${id}`, update);
      const response = await patch(dispatch, parameters);
      if (response) {
        ToggleSuccess("Feature has been updated");
      }
    } catch (err) {
      ToggleError("Unable to update feature");
    }
  };

  useEffect(() => {
    const getAllFeatureFlags = async () => {
      const parameters = generateApiParameters(`${config.API_BASE_URL}/v1/feature-flag/all`);
      const response: any = await get(dispatch, parameters);
      if (response) {
        setFeatureData(response);
      }
    };
    getAllFeatureFlags();
  }, [dispatch]);

  const handleChange = (item: any, i: number) => {
    const updateFeatureData = [...featureData];
    updateFeatureData.splice(i, 1, { ...featureData[i], active_ind: !item.active_ind });
    setFeatureData(updateFeatureData);
    updateFeatureFlag(item.feature_agency_xref_guid, !item.active_ind);
  };

  return (
    <>
      <ToastContainer />
      <div className="comp-page-container comp-page-container--noscroll">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Feature Management</h1>
          </div>
          <p>Manage features within different agency.</p>
          <div className="comp-table">
            <Table
              bordered
              hover
              responsive="sm"
              width={500}
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>Agency</th>
                  <th>Feature</th>
                  <th style={{ width: "80px", textAlign: "center" }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {featureData ? (
                  featureData.map((item, i) => {
                    return (
                      <tr key={item.feature_agency_xref_guid}>
                        <td>{i + 1}</td>
                        <td>{item.agency_code.agency_code}</td>
                        <td style={{ maxWidth: "500px", wordWrap: "break-word", whiteSpace: "normal" }}>
                          {item.feature_code.short_description}
                        </td>
                        <td style={{ width: "80px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            id="feature1"
                            checked={item.active_ind}
                            onChange={() => handleChange(item, i)}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

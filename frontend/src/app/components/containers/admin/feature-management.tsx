import { FC, useEffect, useState } from "react";
import { useAppDispatch } from "@hooks/hooks";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { Table } from "react-bootstrap";
import { generateApiParameters, get, patch } from "@common/api";
import config from "@/config";

export const FeatureManagement: FC = () => {
  const dispatch = useAppDispatch();

  const [featureData, setFeatureData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleChange = (item: any) => {
    const updateFeatureData = [...featureData];
    const originalIndex = featureData.findIndex((f) => f.feature_agency_xref_guid === item.feature_agency_xref_guid);
    if (originalIndex !== -1) {
      updateFeatureData.splice(originalIndex, 1, { ...featureData[originalIndex], active_ind: !item.active_ind });
      setFeatureData(updateFeatureData);
      updateFeatureFlag(item.feature_agency_xref_guid, !item.active_ind);
    }
  };

  // Filter feature data based on search query
  const filteredFeatureData = featureData.filter((item) => {
    if (!searchQuery) return true;

    const agencyMatch = item.agency_code_ref?.toLowerCase().includes(searchQuery.toLowerCase());
    const featureMatch = item.feature_code?.short_description?.toLowerCase().includes(searchQuery.toLowerCase());

    return agencyMatch || featureMatch;
  });

  return (
    <>
      <div className="comp-page-container">
        <div className="comp-page-header">
          <div className="comp-page-title-container">
            <h1>Feature Management</h1>
          </div>
          <p>Manage features within different agency.</p>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by agency or feature description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                {filteredFeatureData ? (
                  filteredFeatureData.map((item, i) => {
                    return (
                      <tr key={item.feature_agency_xref_guid}>
                        <td>{i + 1}</td>
                        <td>{item.agency_code_ref}</td>
                        <td style={{ maxWidth: "500px", wordWrap: "break-word", whiteSpace: "normal" }}>
                          {item.feature_code.short_description}
                        </td>
                        <td style={{ width: "80px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            id="feature1"
                            checked={item.active_ind}
                            onChange={() => handleChange(item)}
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

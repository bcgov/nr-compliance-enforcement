import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { ToggleError, ToggleSuccess } from "@common/toast";
import { Table } from "react-bootstrap";
import { generateApiParameters, patch } from "@common/api";
import config from "@/config";
import { getAllFeatureFlags, getFeatureFlag, selectAllFeatureFlags } from "@store/reducers/app";

export const FeatureManagement: FC = () => {
  const dispatch = useAppDispatch();

  const featureData = useAppSelector(selectAllFeatureFlags);
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
        // refresh this session's flags so the change is testable without a reload
        dispatch(getFeatureFlag());
        dispatch(getAllFeatureFlags());
        ToggleSuccess("Feature has been updated");
      }
    } catch (err) {
      ToggleError("Unable to update feature");
    }
  };

  useEffect(() => {
    dispatch(getAllFeatureFlags());
  }, [dispatch]);

  // Filter feature data based on search query
  const filteredFeatureData = searchQuery
    ? featureData.filter((item) => {
        const agencyMatch = item.agency_code_ref?.toLowerCase().includes(searchQuery.toLowerCase());
        const featureMatch = item.feature_code?.short_description?.toLowerCase().includes(searchQuery.toLowerCase());

        return agencyMatch || featureMatch;
      })
    : featureData;

  return (
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
                <th>Description</th>
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
                      <td style={{ maxWidth: "500px", wordWrap: "break-word", whiteSpace: "normal" }}>
                        {item.feature_code.long_description}
                      </td>
                      <td style={{ width: "80px", textAlign: "center" }}>
                        <input
                          type="checkbox"
                          id="feature1"
                          checked={item.active_ind}
                          onChange={() => updateFeatureFlag(item.feature_agency_xref_guid, !item.active_ind)}
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
  );
};

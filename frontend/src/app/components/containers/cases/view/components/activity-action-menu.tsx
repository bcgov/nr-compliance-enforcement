import { openModal } from "@/app/store/reducers/app";
import { REMOVE_ACTIVITY_FROM_CASE } from "@/app/types/modal/modal-types";
import { Dropdown } from "react-bootstrap";
import { useAppDispatch } from "@/app/hooks/hooks";
import { useGraphQLMutation } from "@/app/graphql/hooks/useGraphQLMutation";
import { ToggleError, ToggleSuccess } from "@/app/common/toast";
import { FC, useCallback } from "react";
import { gql } from "graphql-request";
import { CaseActivityType } from "@/app/constants/case-activity-types";

const REMOVE_ACTIVITY_FROM_CASE_MUTATION = gql`
  mutation RemoveCaseActivity($input: CaseActivityRemoveInput!) {
    removeCaseActivity(input: $input) {
      caseActivityGuid
      caseFileGuid
      activityIdentifier
    }
  }
`;

type ActivityActionMenuProps = {
  activityId: string;
  caseName?: string;
  caseIdentifier: string;
  activityType: CaseActivityType;
};

export const ActivityActionMenu: FC<ActivityActionMenuProps> = ({
  activityId,
  caseName,
  caseIdentifier,
  activityType,
}) => {
  const dispatch = useAppDispatch();

  const removeActivityFromCaseMutation = useGraphQLMutation(REMOVE_ACTIVITY_FROM_CASE_MUTATION, {
    onSuccess: () => {
      ToggleSuccess("Activity removed successfully");
    },
    onError: (error: any) => {
      console.error("Error removing activity:", error);
      ToggleError(error.response?.errors?.[0]?.extensions?.originalError ?? "Failed to remove activity");
    },
  });

  const handleRemove = useCallback(() => {
    const caseDisplay = caseName || caseIdentifier;
    dispatch(
      openModal({
        modalSize: "md",
        modalType: REMOVE_ACTIVITY_FROM_CASE,
        data: {
          title: "Remove complaint from case",
          description: `This action will remove complaint #${activityId} from case file ${caseDisplay}`,
        },
        callback: () => {
          removeActivityFromCaseMutation.mutate({
            input: {
              caseFileGuid: caseIdentifier,
              activityIdentifier: activityId,
            },
          });
        },
      }),
    );
  }, [dispatch, activityId, caseName, caseIdentifier, removeActivityFromCaseMutation]);

  return (
    <div className="comp-header-actions">
      <div className="comp-actions">
        <Dropdown>
          <Dropdown.Toggle
            variant="link"
            className="p-0"
            bsPrefix="dropdown-toggle-no-caret"
            id="dropdown-basic"
          >
            <i className="bi bi-three-dots-vertical"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item
              as="button"
              onClick={handleRemove}
            >
              <i className="bi bi-trash3"></i>
              <span>Remove</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

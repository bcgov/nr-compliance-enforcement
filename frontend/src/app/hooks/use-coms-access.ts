import { useQuery } from "@tanstack/react-query";
import config from "@/config";
import { generateApiParameters, get, put } from "@common/api";
import { getBucketForAttachmentType } from "@common/attachment-utils";
import AttachmentEnum from "@constants/attachment-enum";
import { useAppDispatch, useAppSelector } from "@hooks/hooks";
import { appUserGuid } from "@store/reducers/app";

export const useComsAccess = (attachmentType: AttachmentEnum) => {
  const dispatch = useAppDispatch();
  const userGuid = useAppSelector(appUserGuid);
  const bucketId = getBucketForAttachmentType(attachmentType);

  return useQuery({
    queryKey: ["coms-access", bucketId],
    queryFn: async () => {
      const bucketParams = generateApiParameters(`${config.COMS_URL}/bucket/${bucketId}`);
      try {
        await get(dispatch, bucketParams);
      } catch {
        await put(
          dispatch,
          generateApiParameters(`${config.API_BASE_URL}/v1/app-user/request-coms-access/${userGuid}`),
        );
        // Re-check after requesting access, if still fails we want to show the error banner
        await get(dispatch, bucketParams);
      }
      return true;
    },
    enabled: !!userGuid,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

import { useMutation } from "@vue/apollo-composable";
import file from "../graphql/file.mutation.gql";
import { type UploadFile } from "@/models/file";

export const useUploadFile = () => {
  const { mutate: uploadFile, loading, onError } = useMutation<{ filesUploadMultiple: UploadFile[] }, { files: FileList }>(file, { clientId: "upload" });

  return {
    uploadFile,
    onError,
    loading,
  };
};

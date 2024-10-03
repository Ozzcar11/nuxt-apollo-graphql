import { useMutation } from "@vue/apollo-composable";
import { type AnyObject } from "@ozzcar11/utilities/types";
import applicationSync from "../graphql/syncApplication.mutation.gql";
import { type UploadFile } from "@/models/file";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { type ApplicationProject } from "@/models";

export type UserApplicationQuestionnaire = {
  id: string;
  value: string;
};

type UserApplicationQuestionnaireInput = {
  question: {
    id: number;
  };
  answer?: {
    id: number;
  } | AnyObject;
  value?: string | null;
  company_comment: string;
  documents: {
    title?: string;
    file: UploadFile;
  }[];
};

type UserApplicationSyncInput = {
  userApplicationQuestionnaires: UserApplicationQuestionnaireInput[];
  projects: ApplicationProject[];
};

export const useApplicationSync = () => {
  const { mutate: syncApplication, loading, onError } = useMutation<UserApplicationQuestionnaire[], { userApplicationSync: UserApplicationSyncInput }>(applicationSync, { clientId: APOLLO_CLIENTS.account.key });

  return {
    syncApplication,
    onError,
    loading,
  };
};

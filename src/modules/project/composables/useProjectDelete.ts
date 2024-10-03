import { useMutation } from "@vue/apollo-composable";
import deleteMutation from "../graphql/delete.mutation.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export const useProjectDelete = () => {
  const { mutate: removeProject, loading, onError } = useMutation<boolean, { userApplicationProjects: { id?: number }[] }>(deleteMutation, { clientId: APOLLO_CLIENTS.account.key });

  return {
    removeProject,
    onError,
    loading,
  };
};

import { useMutation } from "@vue/apollo-composable";
import logoutGql from "../graphql/logout.mutation.gql";

export const useLogout = () => {
  const { mutate: logout, loading, onError } = useMutation<boolean>(logoutGql);

  return {
    logout,
    onError,
    loading,
  };
};

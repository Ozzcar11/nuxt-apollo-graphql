import { useMutation } from "@vue/apollo-composable";
import reset from "../graphql/reset.mutation.gql";

type ResetInput = {
  new_password: string;
  repeat_password: string;
  token: string;
};

export const useReset = () => {
  const { mutate: resetRequest, loading, onError } = useMutation<boolean, { password_reset: ResetInput }>(reset);

  return {
    resetRequest,
    onError,
    loading,
  };
};

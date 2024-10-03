import { useMutation } from "@vue/apollo-composable";
import loginInn from "../graphql/loginInn.mutation.gql";
import { type User } from "@/models";

type loginInnRequest = {
  login: string;
  password: string;
};

type loginInnResponse = {
  user: User;
};

export const useLoginInn = () => {
  const { mutate: loginRequest, loading, onError } = useMutation<{ login: loginInnResponse }, { input: loginInnRequest }>(loginInn);

  return {
    loginRequest,
    onError,
    loading,
  };
};

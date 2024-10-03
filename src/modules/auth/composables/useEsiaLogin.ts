import { useMutation } from "@vue/apollo-composable";
import esiaLogin from "../graphql/esiaLogin.mutation.gql";
import { type User } from "~/models";

export const useEsiaLogin = () => {
  const { mutate: loginEsia, loading, onError } = useMutation<{ esiaLogin: { user: User } }, { input: { orgOid: number; code: string; state: string } }>(esiaLogin);

  return {
    loginEsia,
    onError,
    loading,
  };
};

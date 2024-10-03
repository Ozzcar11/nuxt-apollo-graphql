import { useMutation } from "@vue/apollo-composable";
import esiaLink from "../graphql/esiaLink.mutation.gql";

export type LoginEsiaType = {
  orgOid: string | number;
  state: string;
  code: string;
};

export const useGetAuthLink = () => {
  const { mutate: getLink, loading, onError } = useMutation<{ esiaGetAuthLinkByOrgOid: string }, { input: LoginEsiaType }>(esiaLink);

  return {
    getLink,
    onError,
    loading,
  };
};

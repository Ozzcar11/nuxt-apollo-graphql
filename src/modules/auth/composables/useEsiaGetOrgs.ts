import { useMutation } from "@vue/apollo-composable";
import esiaOrgs from "../graphql/getEsiaOrgs.mutation.gql";

export type EsiaType = {
  orgOid: string | number;
  fullName: string;
  shortName: string;
};

export const useEsiaGetOrgs = () => {
  const { mutate: getOrgs, loading, onError } = useMutation<{ esiaGetOrgs: EsiaType[] }, { input: { code: string; state: string } }>(esiaOrgs);

  return {
    getOrgs,
    onError,
    loading,
  };
};

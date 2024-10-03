import { useMutation } from "@vue/apollo-composable";
import link from "../graphql/link.mutation.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export const useResultLinkGet = () => {
  const { mutate: getLink, loading, onError } = useMutation<{ makeCertificate: string }, { company: { id?: number } }>(link, { clientId: APOLLO_CLIENTS.account.key });

  return {
    getLink,
    onError,
    loading,
  };
};

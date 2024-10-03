import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import get from "../graphql/get.query.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { type PartnerOffer } from "@/models";

export function usePartnersGet(id: number) {
  const query = useQuery<{ partnerOffer: PartnerOffer }>(get, { id }, { clientId: APOLLO_CLIENTS.account.key });
  const partner = computed(() => query.result.value?.partnerOffer || null);

  return {
    partner,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}

import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import applicationTreeGet from "../graphql/applicationTree.query.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { type Area } from "@/models";

export function useApplicationTreeGet() {
  const query = useQuery<{ applicationAreasTree: Area[] }>(applicationTreeGet, {}, { clientId: APOLLO_CLIENTS.account.key, fetchPolicy: "no-cache" });
  const applicationTree = computed(() => query.result.value?.applicationAreasTree || null);

  return {
    applicationTree,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}

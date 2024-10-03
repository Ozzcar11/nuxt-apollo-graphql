import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import get from "../graphql/get.query.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";

type ResultType = {
  application_result: number;
  application_result_max: number;
  scoring_result: number;
  scoring_result_max: number;
  total: number;
  total_max: number;
  level_1: string;
  level_2: string;
  application_date: string;
  scoring_date: string;
};

export function useApplicationResultGet() {
  const query = useQuery<{ userApplicationResultsQuery: ResultType }>(get, {}, { clientId: APOLLO_CLIENTS.account.key, fetchPolicy: "no-cache" });
  const applicationResult = computed(() => query.result.value?.userApplicationResultsQuery || null);

  return {
    applicationResult,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}

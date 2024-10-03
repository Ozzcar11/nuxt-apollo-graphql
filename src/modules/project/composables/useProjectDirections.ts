import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useAsyncFn, useAsyncLoadings, useGqlLoading } from "@ozzcar11/utilities/composables";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import { type TableList } from "@ozzcar11/utilities/types";
import directions from "../graphql/directions.query.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";

type ProjectDirection = {
  id: number;
  name: string;
};

export function useProjectDirectionsList() {
  const query = useQuery<{ list: TableList<ProjectDirection> }>(directions, { limit: UNLIMITED }, { clientId: APOLLO_CLIENTS.account.key });

  const projectDirections = computed(() => query.result.value?.list.items || []);
  const { request: refetch, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    projectDirections,
    refetch,
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
  };
}

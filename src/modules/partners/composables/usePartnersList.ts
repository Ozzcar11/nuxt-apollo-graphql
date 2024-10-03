import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  useAsyncFn,
  useAsyncLoadings,
  useFilters,
  useGqlLoading,
  useMeta,
} from "@ozzcar11/utilities/composables";
import { type TableFilters, type TableList } from "@ozzcar11/utilities/types";

import list from "../graphql/list.query.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { type PartnerOffer } from "@/models";

export type ProgramsListFilters = TableFilters<{
  search: string;
}>;

export const defaultFilters = {
  filter: {
    search: "",
  },
  per_page: 6,
};

export function usePartnersList() {
  const filters = useFilters<ProgramsListFilters>(defaultFilters);

  const query = useQuery<{ list: TableList<PartnerOffer> }>(list, filters.default, { clientId: APOLLO_CLIENTS.account.key });
  const meta = useMeta(query, filters);

  const partnersOffers = computed(() => query.result.value?.list.items || []);
  const { request: refetch, isLoading: refetchLoading } = useAsyncFn(async () => query.refetch());

  return {
    partnersOffers,
    refetch,
    filters,
    meta,
    loading: useAsyncLoadings([useGqlLoading(query), refetchLoading]),
  };
}

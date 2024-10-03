import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import { type TableList } from "@ozzcar11/utilities/types";
import regionsList from "../graphql/list.query.gql";
import { type Region } from "@/models/region";

export async function useRegionsList() {
  const { data, refresh, pending } = await useAsyncQuery<{ list: TableList<Region> }, { limit: number }>(regionsList, {
    page: 1,
    limit: UNLIMITED,
  });

  const list = computed(() => data.value?.list.items || []);

  return {
    list,
    refresh,
    loading: computed(() => pending.value),
  };
}

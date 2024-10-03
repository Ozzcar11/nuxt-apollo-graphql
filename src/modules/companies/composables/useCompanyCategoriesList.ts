import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import { type TableList } from "@ozzcar11/utilities/types";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import companyCategoriesList from "../graphql/companyCategoriesList.query.gql";
import { type CompanyCategory } from "@/models";

export async function useCompanyCategoriesList() {
  const { data, refresh, pending } = await useAsyncQuery<{ list: TableList<CompanyCategory> }, { limit: number; page: number }>(companyCategoriesList, {
    page: 1,
    limit: UNLIMITED,
  });

  const list = computed(() => data.value?.list.items || []);
  const meta = computed(() => data.value?.list.meta);

  return {
    list,
    meta,
    loading: computed(() => pending.value),
    refresh,
  };
}

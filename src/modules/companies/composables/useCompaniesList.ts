import { type Ref, computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import { type TableList } from "@ozzcar11/utilities/types";
import companiesList from "../graphql/companiesList.query.gql";
import { type Company, type CompanyCategory } from "@/models";

export interface CompanyListFilter {
  search?: string;
  company_category?: CompanyCategory;
  region_registration?: {
    id: number;
  };
  okved?: {
    id: number;
  };
}

export interface CompanyListParams {
  page: number;
  limit: number;
  filters: CompanyListFilter;
}

export async function useCompaniesList(params: Ref<CompanyListParams>) {
  const { data, refresh, pending } = await useAsyncQuery<{ list: TableList<Company> }, { limit: number; page: number; filter: CompanyListFilter }>(companiesList, params);

  const list = computed(() => data.value?.list.items || []);
  const meta = computed(() => data.value?.list.meta);

  return {
    list,
    meta,
    loading: computed(() => pending.value),
    refresh,
  };
}

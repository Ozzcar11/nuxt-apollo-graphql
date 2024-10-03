import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import companyByInn from "../graphql/companyByInn.query.gql";
import { type Company } from "@/models";

export async function useCompanyByInn(inn: string) {
  const { data, refresh, pending, error } = await useAsyncQuery<{ company: Company }, { inn: string }>(companyByInn, { inn });

  const company = computed(() => data.value?.company || null);

  return {
    company,
    error,
    loading: computed(() => pending.value),
    refresh,
  };
}

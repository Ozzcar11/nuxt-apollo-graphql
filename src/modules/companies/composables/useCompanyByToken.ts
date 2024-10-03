import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import companyByToken from "../graphql/companyByToken.query.gql";
import { type Company } from "@/models";

export async function useCompanyByToken(token: string) {
  const { data, refresh, pending } = await useAsyncQuery<{ companyByToken: Company }, { token: string }>(companyByToken, { token });
  const company = computed(() => data.value?.companyByToken || null);

  return {
    company,
    loading: computed(() => pending.value),
    refresh,
  };
}

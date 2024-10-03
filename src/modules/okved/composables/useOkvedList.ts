import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import { UNLIMITED } from "@ozzcar11/utilities/constants";
import { type TableList } from "@ozzcar11/utilities/types";
import okvedList from "../graphql/okvedList.query.gql";
import { type Okved } from "~/models/okved.ts";

export async function useOkvedList() {
  const { data, refresh, pending } = await useAsyncQuery<{ list: TableList<Okved> }, { limit: number; page: number }>(okvedList, {
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

import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import tree from "../graphql/tree.query.gql";
import { type Area } from "@/models";

type AreaFilterInput = {
  company_id: number;
};

export async function useAreaTree(params: AreaFilterInput) {
  const { data, refresh, pending, error } = await useAsyncQuery<{ areasTree: Area[] }, { inn: string }>(tree, { filter: params });

  const areaTree = computed(() => data.value?.areasTree || []);

  return {
    areaTree,
    error,
    loading: computed(() => pending.value),
    refresh,
  };
}

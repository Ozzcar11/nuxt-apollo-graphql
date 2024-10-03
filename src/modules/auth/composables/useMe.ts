import { computed } from "vue";
import { useAsyncQuery } from "@ozzcar11/utilities/nuxt";
import me from "../graphql/me.query.gql";
import { type User } from "@/models";
import { APOLLO_CLIENTS } from "@/constants/apollo";

export async function useMe() {
  const { data, refresh, pending } = await useAsyncQuery<{ me: User }, unknown>(me, {}, APOLLO_CLIENTS.account.key);
  const user = computed(() => data.value?.me || null);

  return {
    user,
    loading: computed(() => pending.value),
    refresh,
  };
}

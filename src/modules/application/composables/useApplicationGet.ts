import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useGqlLoading } from "@ozzcar11/utilities/composables";
import get from "../graphql/get.query.gql";
import { type ApplicationStatusType } from "../constants";
import { APOLLO_CLIENTS } from "@/constants/apollo";

type ApplicationType = {
  id: string;
  account_status: ApplicationStatusType;
  created_at: string;
  is_edited: boolean;
};

export function useApplicationGet() {
  const query = useQuery<{ userApplication: ApplicationType }>(get, {}, { clientId: APOLLO_CLIENTS.account.key });
  const application = computed(() => query.result.value?.userApplication || null);

  return {
    application,
    loading: useGqlLoading(query),
    onResult: query.onResult,
    refetch: query.refetch,
  };
}

import { useMutation } from "@vue/apollo-composable";
import { type ValueOf } from "@ozzcar11/utilities/types";
import update from "../graphql/update.mutation.gql";
import { APOLLO_CLIENTS } from "@/constants/apollo";
import { APPLICATION_STATUS } from "@/modules/application/constants";

type ApplicationUpdateType = {
  is_edited: boolean;
};

type ApplicationUpdateInputType = {
  account_status: ValueOf<typeof APPLICATION_STATUS>;
  is_edited: boolean;
};

export const useApplicationUpdate = () => {
  const { mutate: updateApplication, loading, onError } = useMutation<{ userApplication: ApplicationUpdateType }, { userApplication: ApplicationUpdateInputType }>(update, { clientId: APOLLO_CLIENTS.account.key });

  return {
    updateApplication,
    onError,
    loading,
  };
};

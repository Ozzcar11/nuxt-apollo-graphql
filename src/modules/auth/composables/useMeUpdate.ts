import { useMutation } from "@vue/apollo-composable";
import meUpdate from "../graphql/meUpdate.mutation.gql";
import { type Company } from "@/models";
import { type PartialBy } from "@/utils/types";
import { APOLLO_CLIENTS } from "@/constants/apollo";

type meUpdateRequest = {
  company: Pick<Company, "id" | "link" | "trademarks" | "product_information" | "contact_person"> & {
    region_presences: { id: number }[];
  };
  user: {
    old_password: string;
    password: string;
    repeat_password: string;
  } | null;
};

export type CompanyProps = Omit<PartialBy<Company, "id">, "ecology_points" | "staff_points" | "government_points" | "result_points" | "status" | "level_1" | "level_2">;

export const useMeUpdate = () => {
  const { mutate: updateMe, loading, onError } = useMutation<Company, { me: meUpdateRequest }>(meUpdate, { clientId: APOLLO_CLIENTS.account.key });

  return {
    updateMe,
    onError,
    loading,
  };
};

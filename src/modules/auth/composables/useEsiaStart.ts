import { useMutation } from "@vue/apollo-composable";
import esia from "../graphql/startEsia.mutation.gql";

export const useEsiaStart = () => {
  const { mutate: startEsia, loading, onError } = useMutation<{ esiaStart: string }>(esia);

  return {
    startEsia,
    onError,
    loading,
  };
};

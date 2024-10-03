import { useMutation } from "@vue/apollo-composable";
import register from "../graphql/register.mutation.gql";
import { type User } from "@/models";

type RegisterInput = {
  password: string;
  repeat_password: string;
  token: string;
};

export const useRegister = () => {
  const { mutate: registerRequest, loading, onError } = useMutation<{ inviteRegistration: User }, { inviteRegistration: RegisterInput }>(register);

  return {
    registerRequest,
    onError,
    loading,
  };
};

import { type Ref, ref } from "vue";
import { defineStore } from "pinia";

import { useCookie } from "#imports";

import { USER_COOKIE_NAME } from "@/constants/cookie";
import { type User } from "@/models";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const cookie: Ref<User | null> = useCookie(USER_COOKIE_NAME);

  const setUser = (newUser: User | null) => {
    if (!newUser) return;
    user.value = newUser;
    cookie.value = newUser;
  };

  const logout = () => {
    user.value = null;
    cookie.value = null;
  };

  const isLoggedIn = () => {
    return !!user.value;
  };

  return {
    user,
    setUser,
    logout,
    isLoggedIn,
  };
});

import { type RouteLocationNormalized } from "vue-router";

import { type Ref } from "vue";

import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useCookie,
} from "#imports";

import { useMe } from "@/modules/auth/composables/useMe";

import { USER_COOKIE_NAME } from "@/constants/cookie";

import { useUserStore } from "@/stores/useUserStore";

import { type Company } from "@/models";
import { mainRoute } from "@/router";
import { authLogin } from "@/router/auth";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const cookie: Ref<Company | null> = useCookie(USER_COOKIE_NAME);
  const userStore = useUserStore();

  if (!userStore.user) {
    try {
      const { user } = await useMe();
      userStore.setUser(user.value);
      if (!user.value) return navigateTo(authLogin);
    } catch (e) {
      console.error(e);

      return navigateTo(authLogin);
    }
  }

  if (to.query.p === "logout") {
    userStore.logout();
    cookie.value = null;

    return navigateTo(mainRoute);
  }

  if (!cookie.value) return navigateTo(authLogin);
});

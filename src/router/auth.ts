import { type RouteRecordRaw } from "vue-router";

export const authLogin: RouteRecordRaw = {
  path: "/auth/login",
  name: "auth.login",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/auth/login.vue"),
};

export const authLoginInn: RouteRecordRaw = {
  path: "/auth/login/inn",
  name: "auth.login.inn",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/auth/loginInn.vue"),
};

export const authRegister: RouteRecordRaw = {
  path: "/auth/register",
  name: "auth.register",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/auth/register.vue"),
};

export const authReset: RouteRecordRaw = {
  path: "/auth/reset",
  name: "auth.reset",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/auth/reset.vue"),
};

export const authSelectCompany: RouteRecordRaw = {
  path: "/esia/callback",
  name: "esia.callback",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/auth/select-company.vue"),
};

export const authLoginESIA: RouteRecordRaw = {
  path: "/esia/complete",
  name: "esia.complete",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/auth/login-esia.vue"),
};

export const authRoutes: RouteRecordRaw[] = [
  authLogin,
  authLoginInn,
  authRegister,
  authReset,
  authSelectCompany,
  authLoginESIA,
];

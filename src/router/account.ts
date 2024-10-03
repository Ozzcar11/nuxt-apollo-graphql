import { type RouteRecordRaw } from "vue-router";

export const accountAbout: RouteRecordRaw = {
  path: "/account",
  name: "account",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/account/index.vue"),
};

export const accountRoutes: RouteRecordRaw[] = [
  accountAbout,
];

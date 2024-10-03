import { type RouteRecordRaw } from "vue-router";

export const resultsPage: RouteRecordRaw = {
  path: "/results",
  name: "results",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/results/index.vue"),
};

export const resultsRoutes: RouteRecordRaw[] = [
  resultsPage,
];

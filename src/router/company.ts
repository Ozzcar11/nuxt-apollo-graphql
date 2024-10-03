import { type RouteRecordRaw } from "vue-router";

export const companyAbout: RouteRecordRaw = {
  path: "/companies/:inn",
  name: "companies.show",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/company/index.vue"),
};

export const companyRoutes: RouteRecordRaw[] = [
  companyAbout,
];

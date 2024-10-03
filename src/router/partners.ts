import { type RouteRecordRaw } from "vue-router";

export const partnersList: RouteRecordRaw = {
  path: "/partners",
  name: "partners",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/partners/list.vue"),
};

export const partnersShow: RouteRecordRaw = {
  path: "/partners/:id",
  name: "partners.show",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/partners/show.vue"),
};

export const partnersRoutes: RouteRecordRaw[] = [
  partnersList,
  partnersShow,
];

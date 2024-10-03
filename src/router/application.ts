import { type RouteRecordRaw } from "vue-router";

export const applicationEcology: RouteRecordRaw = {
  path: "/application/ecology",
  name: "application.ecology",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/application/ecology.vue"),
};

export const applicationPersonal: RouteRecordRaw = {
  path: "/application/personal",
  name: "application.personal",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/application/personal.vue"),
};

export const applicationGovernment: RouteRecordRaw = {
  path: "/application/government",
  name: "application.government",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/application/government.vue"),
};

export const applicationBusiness: RouteRecordRaw = {
  path: "/application/business",
  name: "application.business",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  component: () => import("@/pages/application/business.vue"),
};

export const applicationMain: RouteRecordRaw = {
  path: "/application",
  name: "application",
  meta: {
    middleware: ["auth"],
    layout: "account",
  },
  redirect: { name: "application.ecology" },
  children: [
    applicationEcology,
    applicationPersonal,
    applicationGovernment,
    applicationBusiness,
  ],
};

export const applicationRoutes: RouteRecordRaw[] = [
  applicationMain,
];

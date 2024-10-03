import { type RouterConfig } from "@nuxt/schema";
import { type RouteRecordSingleView } from "vue-router";
import { authRoutes } from "./auth";
import { accountRoutes } from "./account";
import { applicationRoutes } from "./application";
import { resultsRoutes } from "./results";
import { partnersRoutes } from "./partners";
import { companyRoutes } from "./company";

export const mainRoute: RouteRecordSingleView = {
  name: "main",
  path: "/",
  meta: {
    layout: "default",
  },
  component: () => import("@/pages/main/main.vue"),
};

export const router: RouterConfig = {
  routes: () => {
    return [
      {
        path: "/",
        children: [
          mainRoute,
          ...authRoutes,
          ...accountRoutes,
          ...applicationRoutes,
          ...resultsRoutes,
          ...partnersRoutes,
          ...companyRoutes,
        ],
      },
    ];
  },
  scrollBehavior(to, from, savedPosition) {
    if (to.name === "main") {
      return;
    }

    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
};

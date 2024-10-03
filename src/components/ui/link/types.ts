import { type RouteLocationRaw } from "vue-router";

export type LinkProps = {
  to?: RouteLocationRaw;
  download?: boolean;
  target?: string;
  prependIcon?: string;
};

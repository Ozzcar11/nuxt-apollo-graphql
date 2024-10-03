import { type RouteLocationRaw } from "vue-router";
import { type ComponentColors, type ComponentSizes } from "@/types";

export type ButtonProps = {
  disabled?: boolean;
  color?: ComponentColors;
  prefixIcon?: string;
  postfixIcon?: string;
  size?: ComponentSizes;
  maxWidth?: string;
  to?: RouteLocationRaw;
};

export type ButtonEmits = {
  (e: "click", value: Event): void;
};

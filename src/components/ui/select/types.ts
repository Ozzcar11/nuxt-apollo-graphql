import { type MaybeRef } from "vue";
import { type ComponentSizes } from "@/types";

export type SelectProps<O> = {
  value?: O;
  options?: unknown[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  mode?: "single" | "multiple" | "tags";
  valueProp?: string;
  labelProp?: string;
  size?: ComponentSizes;
  errorMessages?: MaybeRef[] | null;
  returnObject?: boolean;
  variation?: "default" | "filled";
  canDeselect?: boolean;
  openDirection?: "bottom" | "top";
};

export type SelectEmits = {
  (e: "update:modelValue", value: string): void;
};

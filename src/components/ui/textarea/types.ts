import { type MaybeRef } from "vue";
import { type ComponentSizes } from "@/types";

export type TextareaProps = {
  width?: string;
  maxWidth?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  hint?: string;
  size?: ComponentSizes;
  errorMessages?: MaybeRef<string>[] | null;
};

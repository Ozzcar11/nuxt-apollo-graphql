import { type Ref } from "vue";
import { type ComponentSizes } from "@/types";

export type InputProps = {
  disabled?: boolean;
  placeholder?: string;
  prefixIcon?: string;
  postfixIcon?: string;
  invalid?: boolean;
  clearable?: boolean;
  width?: string;
  maxWidth?: string;
  label?: string;
  type?: string;
  hint?: string;
  size?: ComponentSizes;
  mask?: string | null;
  maskOptions?: unknown;
  errorMessages?: (string | Ref<string>)[] | null;
};

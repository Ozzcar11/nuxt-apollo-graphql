export type CheckboxProps = {
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
};

export type CheckboxEmits = {
  (e: "update:modelValue", value: boolean): void;
};

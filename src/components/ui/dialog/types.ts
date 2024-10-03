export type DialogEmits = {
  (e: "submit-dialog"): void;
  (e: "cancel-dialog"): void;
};

export type DialogProps = {
  maxWidth?: string;
};

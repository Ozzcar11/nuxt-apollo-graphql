export const getOnlyNumbers = (input: string) => {
  if (input.length === 0) return "";

  return parseInt(input.replace(/\D/g, ""));
};

export const moneyMask = {
  postProcess: (val: string) => {
    if (!val) return "";

    const validValue = getOnlyNumbers(val);

    if (!validValue) return "";

    return Intl.NumberFormat().format(validValue) + " ₽";
  },
};

export const stringToPhone = (val: string) => val.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5");

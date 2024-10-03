export function formatRevenue(value: number) {
  const numberValue = value.toString();
  if (numberValue.length >= 7) return new Intl.NumberFormat().format(value).slice(0, -8) + " млн ₽";
  if (numberValue.length >= 5) return `0,${numberValue.slice(0, -3)} млн ₽`;
  if (value === 0) return "0,130 млн ₽";

  return numberValue + " ₽";
}

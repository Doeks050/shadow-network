export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCash(value: number): string {
  return `$${formatNumber(value)}`;
}

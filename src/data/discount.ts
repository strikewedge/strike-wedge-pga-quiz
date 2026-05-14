const SHOP_BASE = "https://strikewedge.com";
const REDIRECT_PATH = "/products/strike-wedge";

export function discountUrl(code: string): string {
  return `${SHOP_BASE}/discount/${encodeURIComponent(code)}?redirect=${encodeURIComponent(REDIRECT_PATH)}`;
}

export const SALE_END_LABEL = "Sale ends Sunday, May 17";

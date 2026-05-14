const SHOP_BASE = "https://strikewedge.com";
const PRODUCT_HANDLE = "strike-wedge";

export function discountUrl(code: string): string {
  return `${SHOP_BASE}/discount/${encodeURIComponent(code)}?redirect=/products/${PRODUCT_HANDLE}`;
}

export const SALE_END_LABEL = "Sale ends Sunday, May 17";

import { Camera, Lens, PurchaseLinks } from "./types";

/**
 * 검색어 생성 (브랜드 + 모델명)
 */
function getSearchQuery(item: Camera | Lens): string {
  return `${item.brand} ${item.model}`;
}

/**
 * URL 인코딩
 */
function encodeQuery(query: string): string {
  return encodeURIComponent(query);
}

/**
 * 중고나라 검색 URL 생성
 * 실제 URL 형식: https://web.joongna.com/search/{검색어}?keywordSource=INPUT_KEYWORD
 */
export function getJoongnaraLink(item: Camera | Lens): string {
  const query = getSearchQuery(item);
  // 중고나라 실제 검색 URL 형식 (검색어는 URL 인코딩)
  const encodedQuery = encodeQuery(query);
  return `https://web.joongna.com/search/${encodedQuery}?keywordSource=INPUT_KEYWORD`;
}

/**
 * 번개장터 검색 URL 생성
 */
export function getBunjangLink(item: Camera | Lens): string {
  const query = encodeQuery(getSearchQuery(item));
  return `https://m.bunjang.co.kr/search/products?q=${query}`;
}

/**
 * 모든 구매 링크 생성
 */
export function generatePurchaseLinks(item: Camera | Lens): PurchaseLinks {
  return {
    joongnara: getJoongnaraLink(item),
    bunjang: getBunjangLink(item),
  };
}

/**
 * 구매 링크가 있는 경우 사용, 없으면 자동 생성
 */
export function getPurchaseLinks(item: Camera | Lens): PurchaseLinks {
  if (item.purchaseLinks) {
    return item.purchaseLinks;
  }
  return generatePurchaseLinks(item);
}


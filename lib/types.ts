// Usage type (용도)
export type UsageType = "photo" | "video" | "both";

// Photography field types (사용 분야)
export type PhotographyField = "travel" | "daily" | "portrait" | "landscape" | "street";

// Priority criteria (우선순위 항목)
export type PriorityCriteria = "weight" | "size" | "sharpness" | "convenience" | "price";

// Priority order (우선순위 순서 - 1이 가장 높음)
export type PriorityOrder = {
  weight: number; // 무게 (1-5)
  size: number; // 작은 크기 (1-5)
  sharpness: number; // 화질 (1-5)
  convenience: number; // 편의성 (1-5)
  price: number; // 가격 (1-5)
};

// Lens priority order (렌즈 우선순위 순서 - 1이 가장 높음)
export type LensPriorityOrder = {
  size: number; // 크기 (1-5)
  weight: number; // 무게 (1-5)
  price: number; // 가격 (1-5)
  bokeh: number; // 아웃포커싱 (1-5)
  zoomRange: number; // 줌 범위 (1-5)
};

// Recommendation type
export type RecommendationType = "body" | "lens";

// Camera mount types (후지필름 전용)
export type Mount = "Fujifilm X";

// Purchase links interface
export interface PurchaseLinks {
  joongnara?: string; // 중고나라 링크 (로그인 없이 검색 가능)
  bunjang?: string; // 번개장터 링크
  newProduct?: string; // 새것 구매 링크 (예: 공식 스토어, 온라인 쇼핑몰)
}

// Camera interface
export interface Camera {
  id: string;
  brand: string;
  model: string;
  mount: Mount;
  sensor: string;
  isoPerformance: number; // 0-100
  weight: number; // grams
  size?: { width: number; height: number; depth: number }; // mm 단위 (크기)
  videoFeatures: boolean;
  price: number; // KRW (중고 시세 기준)
  newPrice?: number; // KRW (새것 가격)
  sharpnessScore: number; // 0-100
  colorScore: number; // 0-100
  afSpeedScore?: number; // 0-100 (optional)
  versatilityScore?: number; // 0-100 (optional)
  convenienceScore?: number; // 0-100 (편의성 점수)
  releaseDate?: string; // 출시일 (YYYY-MM 형식, 예: "2023-01")
  purchaseLinks?: PurchaseLinks; // 구매 링크 (선택사항)
}

// Lens interface
export interface Lens {
  id: string;
  brand: string;
  model: string;
  mount: Mount;
  focalLength: string; // "35mm" or "24-70mm"
  aperture: string; // "f/1.4" or "f/2.8-4"
  weight: number; // grams
  bokehScore: number; // 0-100
  sharpnessScore: number; // 0-100
  lowLightScore: number; // 0-100
  afSpeedScore: number; // 0-100
  versatilityScore: number; // 0-100
  colorScore?: number; // 0-100 (optional)
  price: number; // KRW (중고 시세 기준)
  purchaseLinks?: PurchaseLinks; // 구매 링크 (선택사항)
}

// User input for recommendation
export interface UserInput {
  recommendationType: RecommendationType; // "body" or "lens"
  usageType?: UsageType; // 용도
  photographyFields: PhotographyField[]; // 사용 분야
  budget: number; // 예산 (만원 단위)
  priorityOrder?: PriorityOrder; // 우선순위 순서 (바디 추천용)
  lensPriorityOrder?: LensPriorityOrder; // 렌즈 우선순위 순서 (렌즈 추천용)
  newProductOnly?: boolean; // 새것만 찾기
}

// Recommendation result
export interface RecommendationItem {
  id: string;
  type: "camera" | "lens";
  item: Camera | Lens;
  score: number;
  reasons: string[];
  performanceMatch: {
    [key: string]: number; // criteria -> score
  };
}

export interface CombinationEvaluation {
  itemId: string;
  evaluation: string;
  warning?: string;
}

export interface RecommendationResult {
  topRecommendations: RecommendationItem[];
  combinationEvaluations: CombinationEvaluation[];
  alternatives: {
    budgetUp: RecommendationItem[];
    budgetDown: RecommendationItem[];
  };
}

// Budget helper - 가격 우선순위에 따른 예산 초과 허용 범위 계산
// priceRank: 1-5 (1이 가장 높은 우선순위)
export function getBudgetTolerance(priceRank: number, budget: number): number {
  // budget은 만원 단위이므로 원 단위로 변환
  const budgetInWon = budget * 10000;
  
  // 1순위(가장 중요): 예산 초과 불가
  // 2순위: 예산의 10% 초과 허용
  // 3순위: 예산의 20% 초과 허용
  // 4순위: 예산의 30% 초과 허용
  // 5순위(가장 낮음): 예산의 40% 초과 허용
  if (priceRank === 1) {
    return 0;
  } else if (priceRank === 2) {
    return budgetInWon * 0.1;
  } else if (priceRank === 3) {
    return budgetInWon * 0.2;
  } else if (priceRank === 4) {
    return budgetInWon * 0.3;
  } else {
    return budgetInWon * 0.4;
  }
}


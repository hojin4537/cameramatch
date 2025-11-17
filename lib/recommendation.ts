import {
  Camera,
  Lens,
  UserInput,
  PriorityOrder,
  LensPriorityOrder,
  RecommendationItem,
  RecommendationResult,
  CombinationEvaluation,
  getBudgetTolerance,
  Mount,
} from "./types";
import { getCameras, getLenses, getCameraById, getLensById } from "./db";

// Normalize score to 0-100 range
function normalizeScore(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

// Calculate price score (lower price = higher score for price priority)
// budget는 만원 단위, price는 원 단위
function calculatePriceScore(
  price: number,
  budget: number,
  priceWeight: number
): number {
  const budgetInWon = budget * 10000;
  const tolerance = getBudgetTolerance(priceWeight, budget);
  const maxAllowedPrice = budgetInWon + tolerance;

  if (price <= budgetInWon) {
    return 100; // 예산 내
  }
  if (price > maxAllowedPrice) {
    return 0; // 허용 범위 초과
  }
  // 예산 초과 허용 범위 내에서 선형 보간
  return normalizeScore(maxAllowedPrice - price, 0, tolerance);
}

// Calculate weight score (lighter = higher score)
function calculateWeightScore(weight: number, minWeight: number, maxWeight: number): number {
  return 100 - normalizeScore(weight, minWeight, maxWeight);
}

// Calculate size score (smaller = higher score)
function calculateSizeScore(
  size: { width: number; height: number; depth: number } | undefined,
  allSizes: Array<{ width: number; height: number; depth: number } | undefined>
): number {
  if (!size) return 50; // 크기 정보 없으면 중간 점수
  
  const volume = size.width * size.height * size.depth;
  const volumes = allSizes
    .filter((s): s is { width: number; height: number; depth: number } => s !== undefined)
    .map((s) => s.width * s.height * s.depth);
  
  if (volumes.length === 0) return 50;
  
  const minVolume = Math.min(...volumes);
  const maxVolume = Math.max(...volumes);
  
  return 100 - normalizeScore(volume, minVolume, maxVolume);
}

// Calculate convenience score
function calculateConvenienceScore(camera: Camera): number {
  // 편의성 점수가 있으면 사용, 없으면 기본값 계산
  if (camera.convenienceScore !== undefined) {
    return camera.convenienceScore;
  }
  
  // 기본 편의성 점수: AF 속도, 다재다능성 등을 종합
  const afScore = camera.afSpeedScore || 50;
  const versatilityScore = camera.versatilityScore || 50;
  return (afScore + versatilityScore) / 2;
}

// Calculate release date score (newer = higher score)
// releaseDate format: "YYYY-MM" or undefined
function calculateReleaseDateScore(releaseDate?: string): number {
  if (!releaseDate) return 50; // 출시일 정보 없으면 중간 점수
  
  try {
    const [year, month] = releaseDate.split("-").map(Number);
    const releaseTime = new Date(year, month - 1).getTime();
    const now = new Date().getTime();
    const fiveYearsAgo = new Date(now - 5 * 365 * 24 * 60 * 60 * 1000).getTime();
    
    // 5년 이내 출시: 100점, 5년 이상: 시간에 따라 감소
    if (releaseTime >= fiveYearsAgo) {
      return 100;
    }
    
    // 5년 이상 된 제품은 최대 70점
    const yearsOld = (now - releaseTime) / (365 * 24 * 60 * 60 * 1000);
    return Math.max(30, 100 - (yearsOld - 5) * 5);
  } catch {
    return 50;
  }
}

// Check if two focal lengths overlap
function checkFocalLengthOverlap(focal1: string, focal2: string): boolean {
  const parseFocal = (focal: string): { min: number; max: number } => {
    if (focal.includes("-")) {
      const [min, max] = focal.split("-").map((s) => parseInt(s.replace("mm", "").trim()));
      return { min, max };
    } else {
      const val = parseInt(focal.replace("mm", "").trim());
      return { min: val, max: val };
    }
  };

  const range1 = parseFocal(focal1);
  const range2 = parseFocal(focal2);

  return !(range1.max < range2.min || range1.min > range2.max);
}

// Convert priority order to weights (1순위 = 5점, 5순위 = 1점)
function priorityOrderToWeights(order: PriorityOrder): { [key: string]: number } {
  return {
    weight: 6 - order.weight, // 1순위 = 5점, 5순위 = 1점
    size: 6 - order.size,
    sharpness: 6 - order.sharpness,
    convenience: 6 - order.convenience,
    price: 6 - order.price,
  };
}

// Calculate price score (새것/중고 구분)
function calculatePriceScoreWithNew(
  price: number,
  newPrice: number | undefined,
  budget: number,
  priceWeight: number,
  newProductOnly: boolean
): number {
  const budgetInWon = budget * 10000;
  
  // 새것만 찾기인 경우
  if (newProductOnly) {
    if (!newPrice) return 0; // 새것 가격 정보 없으면 제외
    const tolerance = getBudgetTolerance(priceWeight, budget);
    const maxAllowedPrice = budgetInWon + tolerance;
    
    if (newPrice <= budgetInWon) return 100;
    if (newPrice > maxAllowedPrice) return 0;
    return normalizeScore(maxAllowedPrice - newPrice, 0, tolerance);
  }
  
  // 중고도 포함하는 경우: 중고 가격 기준
  const tolerance = getBudgetTolerance(priceWeight, budget);
  const maxAllowedPrice = budgetInWon + tolerance;
  
  if (price <= budgetInWon) return 100;
  if (price > maxAllowedPrice) return 0;
  return normalizeScore(maxAllowedPrice - price, 0, tolerance);
}

// Calculate score for a camera
function calculateCameraScore(
  camera: Camera,
  userInput: UserInput,
  priorityOrder: PriorityOrder,
  allCameras: Camera[]
): { score: number; performanceMatch: { [key: string]: number } } {
  const { budget, newProductOnly = false } = userInput;

  // Get min/max values for normalization
  const weights_ = allCameras.map((c) => c.weight);
  const minWeight = Math.min(...weights_);
  const maxWeight = Math.max(...weights_);
  
  const allSizes = allCameras.map((c) => c.size);

  // Calculate individual scores
  const weightScore = calculateWeightScore(camera.weight, minWeight, maxWeight);
  const sizeScore = calculateSizeScore(camera.size, allSizes);
  const sharpnessScore = camera.sharpnessScore;
  const convenienceScore = calculateConvenienceScore(camera);
  const priceScore = calculatePriceScoreWithNew(
    camera.price,
    camera.newPrice,
    budget,
    priorityOrder.price,
    newProductOnly
  );

  // Convert priority order to weights
  const weights = priorityOrderToWeights(priorityOrder);

  // Calculate weighted total
  const totalScore =
    weightScore * weights.weight +
    sizeScore * weights.size +
    sharpnessScore * weights.sharpness +
    convenienceScore * weights.convenience +
    priceScore * weights.price;

  const performanceMatch = {
    weight: weightScore,
    size: sizeScore,
    sharpness: sharpnessScore,
    convenience: convenienceScore,
    price: priceScore,
  };

  return { score: totalScore, performanceMatch };
}

// Calculate portability score (lighter = higher score)
function calculatePortabilityScore(weight: number, minWeight: number, maxWeight: number): number {
  return 100 - normalizeScore(weight, minWeight, maxWeight);
}

// Calculate zoom range score (wider range = higher score)
function calculateZoomRangeScore(focalLength: string, allFocalLengths: string[]): number {
  // Parse focal length
  const parseFocal = (focal: string): { min: number; max: number } => {
    if (focal.includes("-")) {
      const [min, max] = focal.split("-").map((s) => parseInt(s.replace("mm", "").trim()));
      return { min, max };
    } else {
      const val = parseInt(focal.replace("mm", "").trim());
      return { min: val, max: val };
    }
  };

  const range = parseFocal(focalLength);
  const zoomRange = range.max - range.min; // 단초점 렌즈는 0

  // Calculate zoom ranges for all lenses
  const zoomRanges = allFocalLengths.map((focal) => {
    const r = parseFocal(focal);
    return r.max - r.min;
  });

  const minZoomRange = Math.min(...zoomRanges);
  const maxZoomRange = Math.max(...zoomRanges);

  // 줌 범위가 넓을수록 높은 점수
  if (maxZoomRange === minZoomRange) return 50;
  return normalizeScore(zoomRange, minZoomRange, maxZoomRange);
}

// Convert lens priority order to weights (1순위 = 5점, 5순위 = 1점)
function lensPriorityOrderToWeights(order: LensPriorityOrder): { [key: string]: number } {
  return {
    size: 6 - order.size,
    weight: 6 - order.weight,
    price: 6 - order.price,
    bokeh: 6 - order.bokeh,
    zoomRange: 6 - order.zoomRange,
  };
}

// Calculate lens score based on usage type, photography fields, and priority order
function calculateLensScoreForRecommendation(
  lens: Lens,
  userInput: UserInput,
  allLenses: Lens[],
  lensPriorityOrder: LensPriorityOrder
): { score: number; performanceMatch: { [key: string]: number } } {
  const { budget, usageType, photographyFields, newProductOnly = false } = userInput;

  // Get min/max values for normalization
  const weights_ = allLenses.map((l) => l.weight);
  const minWeight = Math.min(...weights_);
  const maxWeight = Math.max(...weights_);
  const allFocalLengths = allLenses.map((l) => l.focalLength);

  // Calculate individual scores
  const weightScore = calculatePortabilityScore(lens.weight, minWeight, maxWeight);
  const sizeScore = weightScore; // 렌즈에 size 정보가 없으므로 무게로 대체 (가벼우면 작은 크기)
  const bokehScore = lens.bokehScore;
  const priceScore = calculatePriceScore(
    lens.price,
    budget,
    lensPriorityOrder.price
  );
  const zoomRangeScore = calculateZoomRangeScore(lens.focalLength, allFocalLengths);

  // Convert priority order to weights
  const weights = lensPriorityOrderToWeights(lensPriorityOrder);

  // Field-based adjustments (촬영 분야에 따른 보너스)
  let fieldBonus = 0;

  // Portrait: 보케 중요
  if (photographyFields.includes("portrait")) {
    if (bokehScore >= 80) {
      fieldBonus += 10;
    }
    // 초점거리 체크 (50-135mm가 인물에 적합)
    const focalNum = parseInt(lens.focalLength.replace("mm", "").split("-")[0]);
    if (focalNum >= 50 && focalNum <= 135) {
      fieldBonus += 5;
    }
  }

  // Travel: 휴대성 중요
  if (photographyFields.includes("travel")) {
    if (weightScore >= 80) {
      fieldBonus += 10;
    }
    if (zoomRangeScore >= 70) {
      fieldBonus += 5; // 줌 렌즈가 여행에 유리
    }
  }

  // Street: 휴대성, 저조도 중요
  if (photographyFields.includes("street")) {
    if (weightScore >= 80) {
      fieldBonus += 5;
    }
  }

  // Daily: 줌 범위 중요
  if (photographyFields.includes("daily")) {
    if (zoomRangeScore >= 70) {
      fieldBonus += 5;
    }
  }

  // Calculate weighted total
  const totalScore =
    sizeScore * weights.size +
    weightScore * weights.weight +
    priceScore * weights.price +
    bokehScore * weights.bokeh +
    zoomRangeScore * weights.zoomRange +
    fieldBonus;

  const performanceMatch = {
    size: sizeScore,
    weight: weightScore,
    price: priceScore,
    bokeh: bokehScore,
    zoomRange: zoomRangeScore,
  };

  return { score: totalScore, performanceMatch };
}

// Generate camera recommendation reasons
function generateCameraReasons(
  camera: Camera,
  userInput: UserInput,
  priorityOrder: PriorityOrder,
  performanceMatch: { [key: string]: number }
): string[] {
  const reasons: string[] = [];

  // Check top priorities (1-3순위)
  const sortedPriorities = Object.entries(priorityOrder)
    .sort(([_, a], [__, b]) => a - b) // 순위가 낮을수록(1에 가까울수록) 우선순위 높음
    .slice(0, 3);

  sortedPriorities.forEach(([key, rank]) => {
    const score = performanceMatch[key];
    if (score >= 70) {
      if (key === "weight") {
        reasons.push("가벼워 휴대성이 뛰어납니다.");
      } else if (key === "size") {
        reasons.push("작은 크기로 휴대하기 편리합니다.");
      } else if (key === "sharpness") {
        reasons.push("뛰어난 화질을 제공합니다.");
      } else if (key === "convenience") {
        reasons.push("사용하기 편리한 기능을 갖추고 있습니다.");
      } else if (key === "price") {
        reasons.push("예산 대비 우수한 가성비를 제공합니다.");
      }
    }
  });

  // Ensure at least 3 reasons
  while (reasons.length < 3) {
    reasons.push("사용자의 우선순위와 잘 맞는 장비입니다.");
  }

  return reasons.slice(0, 5);
}

// Evaluate combination with owned gear
function evaluateCombination(
  newItem: Camera | Lens,
  newItemType: "camera" | "lens",
  userInput: UserInput,
  allCameras: Camera[],
  allLenses: Lens[]
): CombinationEvaluation {
  const evaluation: CombinationEvaluation = {
    itemId: newItem.id,
    evaluation: "",
  };

  if (newItemType === "camera") {
    // 바디 추천에서는 보유 장비 평가 제거
    evaluation.evaluation = "후지필름 X 마운트 렌즈와 호환됩니다.";
  } else {
    // 렌즈 추천: 모든 후지필름 X 마운트 바디와 호환
    evaluation.evaluation = "후지필름 X 마운트 바디와 호환됩니다.";
  }

  return evaluation;
}

// Filter items by budget with tolerance
function filterByBudget<T extends { price: number }>(
  items: T[],
  budget: number,
  priceWeight: number
): T[] {
  const budgetInWon = budget * 10000;
  const tolerance = getBudgetTolerance(priceWeight, budget);
  const maxAllowedPrice = budgetInWon + tolerance;

  return items.filter((item) => item.price <= maxAllowedPrice);
}

// Check mount compatibility
function checkMountCompatibility(
  item: Camera | Lens,
  ownedCamera?: Camera,
  ownedLenses?: Lens[]
): boolean {
  if (ownedCamera && "mount" in item) {
    return item.mount === ownedCamera.mount;
  }
  if (ownedLenses && ownedLenses.length > 0 && "mount" in item) {
    return ownedLenses.some((lens) => lens.mount === item.mount);
  }
  return true; // No owned gear, so compatible
}

// Generate lens recommendation reasons
function generateLensReasons(
  lens: Lens,
  userInput: UserInput,
  performanceMatch: { [key: string]: number }
): string[] {
  const reasons: string[] = [];
  const { photographyFields, usageType, lensPriorityOrder } = userInput;

  if (!lensPriorityOrder) {
    return ["사용자의 용도와 잘 맞는 렌즈입니다."];
  }

  // Check top priorities (1-3순위)
  const sortedPriorities = Object.entries(lensPriorityOrder)
    .sort(([_, a], [__, b]) => a - b) // 순위가 낮을수록(1에 가까울수록) 우선순위 높음
    .slice(0, 3);

  sortedPriorities.forEach(([key, rank]) => {
    const score = performanceMatch[key as keyof typeof performanceMatch];
    if (score >= 70) {
      if (key === "weight") {
        reasons.push("가벼워 휴대성이 뛰어납니다.");
      } else if (key === "size") {
        reasons.push("작은 크기로 휴대하기 편리합니다.");
      } else if (key === "bokeh") {
        reasons.push("아름다운 아웃포커싱 효과를 연출합니다.");
      } else if (key === "price") {
        reasons.push("예산 대비 우수한 가성비를 제공합니다.");
      } else if (key === "zoomRange") {
        const parseFocal = (focal: string): { min: number; max: number } => {
          if (focal.includes("-")) {
            const [min, max] = focal.split("-").map((s) => parseInt(s.replace("mm", "").trim()));
            return { min, max };
          } else {
            const val = parseInt(focal.replace("mm", "").trim());
            return { min: val, max: val };
          }
        };
        const range = parseFocal(lens.focalLength);
        if (range.max - range.min > 0) {
          reasons.push("넓은 줌 범위로 다양한 촬영이 가능합니다.");
        }
      }
    }
  });

  // Field-specific reasons
  if (photographyFields.includes("portrait")) {
    const focalNum = parseInt(lens.focalLength.replace("mm", "").split("-")[0]);
    if (focalNum >= 50 && focalNum <= 135) {
      reasons.push("인물 촬영에 최적화된 초점거리입니다.");
    }
  }

  if (photographyFields.includes("travel")) {
    if (lens.weight < 300) {
      reasons.push("여행에 적합한 가벼운 무게입니다.");
    }
  }

  if (photographyFields.includes("street")) {
    const apertureNum = parseFloat(lens.aperture.replace("f/", "").split("-")[0]);
    if (apertureNum <= 2.0) {
      reasons.push("밝은 조리개로 스트릿 촬영에 유리합니다.");
    }
  }

  // Usage type reasons
  if (usageType === "video") {
    if (lens.afSpeedScore >= 80) {
      reasons.push("영상 촬영에 적합한 빠른 AF 성능입니다.");
    }
  }

  // Ensure at least 3 reasons
  while (reasons.length < 3) {
    reasons.push("사용자의 용도와 잘 맞는 렌즈입니다.");
  }

  return reasons.slice(0, 5);
}

// Main recommendation function
export async function getRecommendations(
  userInput: UserInput,
  priorityOrder?: PriorityOrder
): Promise<RecommendationResult> {
  // Fetch all data
  const allCameras = await getCameras();
  const allLenses = await getLenses();

  // Determine if we're recommending camera or lens based on recommendationType
  const recommendLenses = userInput.recommendationType === "lens";

  let recommendations: RecommendationItem[] = [];

  if (recommendLenses) {
    // Recommend lenses
    if (!userInput.lensPriorityOrder) {
      throw new Error("LensPriorityOrder is required for lens recommendations");
    }

    let candidateLenses = allLenses;

    // Filter by budget (렌즈는 newPrice가 없으므로 중고 가격 기준)
    const budgetInWon = userInput.budget * 10000;
    const priceRank = userInput.lensPriorityOrder.price;
    const tolerance = getBudgetTolerance(priceRank, userInput.budget);
    const maxAllowedPrice = budgetInWon + tolerance;
    candidateLenses = candidateLenses.filter((lens) => lens.price <= maxAllowedPrice);

    // Calculate scores
    const scoredLenses = candidateLenses.map((lens) => {
      const { score, performanceMatch } = calculateLensScoreForRecommendation(
        lens,
        userInput,
        allLenses,
        userInput.lensPriorityOrder!
      );
      return {
        id: lens.id,
        type: "lens" as const,
        item: lens,
        score,
        reasons: generateLensReasons(lens, userInput, performanceMatch),
        performanceMatch,
      };
    });

    // Sort by score and take top 3
    recommendations = scoredLenses.sort((a, b) => b.score - a.score).slice(0, 3);
  } else {
    // Recommend cameras (기존 로직)
    if (!priorityOrder) {
      throw new Error("PriorityOrder is required for camera recommendations");
    }
    // Recommend cameras
    let candidateCameras = allCameras;

    // 새것만 찾기 필터링
    if (userInput.newProductOnly) {
      candidateCameras = candidateCameras.filter((camera) => camera.newPrice !== undefined);
    }

    // Filter by budget (새것/중고 구분)
    const priceWeight = priorityOrder.price;
    if (userInput.newProductOnly) {
      // 새것만: 새것 가격 기준
      const budgetInWon = userInput.budget * 10000;
      const tolerance = getBudgetTolerance(priceWeight, userInput.budget);
      const maxAllowedPrice = budgetInWon + tolerance;
      candidateCameras = candidateCameras.filter(
        (camera) => camera.newPrice && camera.newPrice <= maxAllowedPrice
      );
    } else {
      // 중고 포함: 중고 가격 기준
      candidateCameras = filterByBudget(candidateCameras, userInput.budget, priceWeight);
    }

    // Calculate scores
    const scoredCameras = candidateCameras.map((camera) => {
      const { score, performanceMatch } = calculateCameraScore(
        camera,
        userInput,
        priorityOrder,
        allCameras
      );
      return {
        id: camera.id,
        type: "camera" as const,
        item: camera,
        score,
        reasons: generateCameraReasons(camera, userInput, priorityOrder, performanceMatch),
        performanceMatch,
      };
    });

    // Sort by score and take top 3
    recommendations = scoredCameras.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // Generate combination evaluations
  const combinationEvaluations = recommendations.map((rec) =>
    evaluateCombination(
      rec.item,
      rec.type,
      userInput,
      allCameras,
      allLenses
    )
  );

  // Generate alternatives (budget up/down)
  const alternatives: RecommendationResult["alternatives"] = {
    budgetUp: [],
    budgetDown: [],
  };

  // For budget up, look for items in next budget range
  // For budget down, look for items in previous budget range
  // This is simplified for MVP - can be enhanced later

  return {
    topRecommendations: recommendations,
    combinationEvaluations,
    alternatives,
  };
}



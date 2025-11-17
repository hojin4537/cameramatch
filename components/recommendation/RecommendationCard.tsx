import { RecommendationItem } from "@/lib/types";
import { Camera, Lens } from "@/lib/types";
import { getPurchaseLinks } from "@/lib/purchaseLinks";

interface RecommendationCardProps {
  recommendation: RecommendationItem;
  index: number;
}

export default function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  const item = recommendation.item;
  const isLens = recommendation.type === "lens";
  const lens = isLens ? (item as Lens) : null;
  const camera = !isLens ? (item as Camera) : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-1 text-sm font-semibold text-gray-500">
            추천 #{index + 1}
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {item.brand} {item.model}
          </h3>
          {isLens && lens && (
            <p className="mt-1 text-sm text-gray-600">
              {lens.focalLength} · {lens.aperture}
            </p>
          )}
          {!isLens && camera && (
            <p className="mt-1 text-sm text-gray-600">
              {camera.sensor} · {camera.weight}g
              {camera.size && ` · ${camera.size.width}×${camera.size.height}×${camera.size.depth}mm`}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(recommendation.score)}
          </div>
          <div className="text-xs text-gray-500">점수</div>
        </div>
      </div>

      {/* 주요 스펙 */}
      {!isLens && camera && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-semibold text-gray-700">주요 스펙</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">센서: </span>
              <span className="font-semibold text-gray-900">{camera.sensor}</span>
            </div>
            <div>
              <span className="text-gray-600">무게: </span>
              <span className="font-semibold text-gray-900">{camera.weight}g</span>
            </div>
            {camera.size && (
              <div>
                <span className="text-gray-600">크기: </span>
                <span className="font-semibold text-gray-900">
                  {camera.size.width}×{camera.size.height}×{camera.size.depth}mm
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600">영상: </span>
              <span className="font-semibold text-gray-900">
                {camera.videoFeatures ? "지원" : "미지원"}
              </span>
            </div>
            {camera.afSpeedScore && (
              <div>
                <span className="text-gray-600">AF 성능: </span>
                <span className="font-semibold text-gray-900">{camera.afSpeedScore}/100</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">화질: </span>
              <span className="font-semibold text-gray-900">{camera.sharpnessScore}/100</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">추천 이유</h4>
        <ul className="space-y-1">
          {recommendation.reasons.map((reason, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              • {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* 새것/중고 시세 */}
      {!isLens && camera && (
        <div className="mb-4 space-y-2 rounded-lg border-2 border-gray-200 bg-white p-4">
          <h4 className="text-sm font-semibold text-gray-700">시세</h4>
          {camera.newPrice && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">새것: </span>
              <span className="text-lg font-bold text-gray-900">
                {camera.newPrice.toLocaleString("ko-KR")}원
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">중고: </span>
            <span className="text-lg font-bold text-gray-900">
              {item.price.toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>
      )}

      {/* 구매 링크 */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">구매 링크</h4>
        
        {/* 새것 구매 링크 */}
        {!isLens && camera && camera.purchaseLinks?.newProduct && (
          <div className="mb-3">
            <span className="mb-2 block text-xs font-semibold text-gray-600">새것 구매</span>
            <a
              href={camera.purchaseLinks.newProduct}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              새것 구매하기
            </a>
          </div>
        )}

        {/* 중고 구매 링크 */}
        <div>
          <span className="mb-2 block text-xs font-semibold text-gray-600">중고 구매</span>
          <div className="flex flex-wrap gap-2">
            {(() => {
              const links = getPurchaseLinks(item);
              return (
                <>
                  {links.joongnara && (
                    <a
                      href={links.joongnara}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      중고나라
                    </a>
                  )}
                  {links.bunjang && (
                    <a
                      href={links.bunjang}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
                    >
                      번개장터
                    </a>
                  )}
                </>
              );
            })()}
          </div>
        </div>
        
        <p className="mt-3 text-xs text-gray-500">
          * 링크는 자동 생성된 검색 결과입니다. 실제 시세는 각 사이트에서 확인해주세요.
        </p>
      </div>
    </div>
  );
}


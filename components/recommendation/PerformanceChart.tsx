import { RecommendationItem } from "@/lib/types";

interface PerformanceChartProps {
  recommendation: RecommendationItem;
}

export default function PerformanceChart({
  recommendation,
}: PerformanceChartProps) {
  const { performanceMatch } = recommendation;

  // Get max value for normalization
  const maxValue = Math.max(...Object.values(performanceMatch), 100);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">성능 매칭</h4>
      <div className="space-y-2">
        {Object.entries(performanceMatch).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{key}</span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-gray-900 transition-all"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


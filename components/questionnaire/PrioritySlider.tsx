"use client";

import { PriorityWeights } from "@/lib/types";

interface PrioritySliderProps {
  weights: PriorityWeights;
  onChange: (weights: PriorityWeights) => void;
}

const priorityLabels: Record<keyof PriorityWeights, string> = {
  portability: "휴대성",
  sharpness: "화질",
  afSpeed: "AF 성능",
  releaseDate: "출시일",
  price: "가격",
};

export default function PrioritySlider({
  weights,
  onChange,
}: PrioritySliderProps) {
  const updateWeight = (key: keyof PriorityWeights, value: number) => {
    onChange({
      ...weights,
      [key]: value,
    });
  };

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          우선순위를 설정해주세요 (0-5점)
        </h3>
        <div className="text-sm text-gray-600">
          총합: <span className="font-semibold">{totalWeight}</span>
        </div>
      </div>

      <div className="space-y-6">
        {(Object.keys(priorityLabels) as Array<keyof PriorityWeights>).map(
          (key) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-900">
                  {priorityLabels[key]}
                </label>
                <span className="text-lg font-semibold text-gray-900">
                  {weights[key]}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={weights[key]}
                onChange={(e) => updateWeight(key, parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                style={{
                  background: `linear-gradient(to right, #111827 0%, #111827 ${
                    (weights[key] / 5) * 100
                  }%, #e5e7eb ${(weights[key] / 5) * 100}%, #e5e7eb 100%)`,
                }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}


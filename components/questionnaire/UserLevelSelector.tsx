"use client";

import { UserLevel } from "@/lib/types";

interface UserLevelSelectorProps {
  selectedLevel: UserLevel | null;
  onChange: (level: UserLevel) => void;
}

const levelOptions: { value: UserLevel; label: string; description: string }[] = [
  { value: "professional", label: "작가", description: "상업 촬영 전문" },
  { value: "enthusiast", label: "매니아", description: "취미 사진가" },
  { value: "beginner", label: "입문자", description: "처음 시작하는 분" },
];

export default function UserLevelSelector({
  selectedLevel,
  onChange,
}: UserLevelSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">내 정보를 선택해주세요</h3>
      <div className="grid grid-cols-3 gap-4">
        {levelOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-start rounded-xl border-2 p-5 text-left transition-all ${
              selectedLevel === option.value
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
            }`}
          >
            <span className="mb-1 text-xl font-bold">{option.label}</span>
            <span className="text-sm opacity-80">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


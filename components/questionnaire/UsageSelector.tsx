"use client";

import { UsageType } from "@/lib/types";

interface UsageSelectorProps {
  selectedUsage: UsageType | null;
  onChange: (usage: UsageType) => void;
}

const usageOptions: { value: UsageType; label: string; icon: string }[] = [
  { value: "photo", label: "사진", icon: "📷" },
  { value: "video", label: "영상", icon: "🎥" },
  { value: "both", label: "사진+영상", icon: "📹" },
];

export default function UsageSelector({
  selectedUsage,
  onChange,
}: UsageSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">용도를 선택해주세요</h3>
      <div className="grid grid-cols-3 gap-4">
        {usageOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 transition-all ${
              selectedUsage === option.value
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
            }`}
          >
            <span className="mb-2 text-3xl">{option.icon}</span>
            <span className="font-semibold">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


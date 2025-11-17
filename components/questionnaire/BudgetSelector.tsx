"use client";

import { BudgetRange } from "@/lib/types";

interface BudgetSelectorProps {
  selectedBudget: BudgetRange | null;
  onChange: (budget: BudgetRange) => void;
}

const budgetOptions: { value: BudgetRange; label: string }[] = [
  { value: "30-50", label: "30-50만원" },
  { value: "50-100", label: "50-100만원" },
  { value: "100-200", label: "100-200만원" },
  { value: "200+", label: "200만원 이상" },
];

export default function BudgetSelector({
  selectedBudget,
  onChange,
}: BudgetSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">예산을 선택해주세요</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border-2 p-4 text-center transition-colors ${
              selectedBudget === option.value
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}


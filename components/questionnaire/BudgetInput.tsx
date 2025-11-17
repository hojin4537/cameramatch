"use client";

import { useState } from "react";

interface BudgetInputProps {
  budget: number | null;
  onChange: (budget: number) => void;
}

// 예산 구간 템플릿 (다른 사이트 스타일)
const budgetRanges = [
  { min: 50, max: 100, label: "50-100만원" },
  { min: 100, max: 150, label: "100-150만원" },
  { min: 150, max: 200, label: "150-200만원" },
  { min: 200, max: 300, label: "200-300만원" },
  { min: 300, max: 500, label: "300-500만원" },
  { min: 500, max: 1000, label: "500만원 이상" },
];

export default function BudgetInput({ budget, onChange }: BudgetInputProps) {
  const [inputValue, setInputValue] = useState<string>(
    budget ? budget.toString() : ""
  );
  const [error, setError] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ min: number; max: number; label: string } | null>(null);

  const handleRangeSelect = (min: number, max: number, label: string) => {
    // 구간 선택 시 최소값을 budget으로 저장 (추천 알고리즘에서 사용)
    setInputValue("");
    setSelectedRange({ min, max, label });
    onChange(min); // 최소값을 budget으로 저장
    setShowCustomInput(false);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedRange(null); // 직접 입력 시 구간 선택 해제

    if (value === "") {
      setError("");
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      setError("올바른 숫자를 입력해주세요");
      return;
    }

    if (numValue < 10) {
      setError("최소 10만원 이상 입력해주세요");
      return;
    }

    if (numValue > 1000) {
      setError("최대 1000만원까지 입력 가능합니다");
      return;
    }

    setError("");
    onChange(numValue);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">예산을 선택해주세요</h3>
      
      {/* 구간 선택 */}
      {!showCustomInput && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {budgetRanges.map((range, idx) => {
            const isSelected = selectedRange?.min === range.min && selectedRange?.max === range.max;
            return (
              <button
                key={idx}
                onClick={() => handleRangeSelect(range.min, range.max, range.label)}
                className={`rounded-lg border-2 p-4 text-center transition-all ${
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="font-semibold">{range.label}</div>
              </button>
            );
          })}
          <button
            onClick={() => setShowCustomInput(true)}
            className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-100"
          >
            <div className="font-semibold">직접 입력</div>
          </button>
        </div>
      )}

      {/* 직접 입력 */}
      {showCustomInput && (
        <div className="space-y-3 rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">
              예산 직접 입력
            </label>
            <button
              onClick={() => setShowCustomInput(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              구간 선택으로
            </button>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="10"
              max="1000"
              value={inputValue}
              onChange={handleCustomInput}
              placeholder="예: 150"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
            />
            <span className="text-gray-600">만원</span>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!error && inputValue && (
            <p className="text-sm text-gray-600">
              예산: {parseInt(inputValue || "0").toLocaleString("ko-KR")}만원
            </p>
          )}
        </div>
      )}

      {/* 선택된 예산 표시 */}
      {budget && !showCustomInput && (
        <div className="rounded-lg bg-gray-100 p-3 text-center">
          <span className="text-sm text-gray-600">선택된 예산: </span>
          <span className="text-lg font-bold text-gray-900">
            {selectedRange ? selectedRange.label : `${budget.toLocaleString("ko-KR")}만원`}
          </span>
        </div>
      )}
    </div>
  );
}

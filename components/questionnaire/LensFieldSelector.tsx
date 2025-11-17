"use client";

import { PhotographyField } from "@/lib/types";

interface LensFieldSelectorProps {
  selectedFields: PhotographyField[];
  onChange: (fields: PhotographyField[]) => void;
}

const lensFields: { value: PhotographyField; label: string }[] = [
  { value: "travel", label: "여행" },
  { value: "daily", label: "일상" },
  { value: "portrait", label: "인물" },
  { value: "landscape", label: "풍경" },
  { value: "street", label: "스트릿" },
];

export default function LensFieldSelector({
  selectedFields,
  onChange,
}: LensFieldSelectorProps) {
  const toggleField = (field: PhotographyField) => {
    if (selectedFields.includes(field)) {
      onChange(selectedFields.filter((f) => f !== field));
    } else {
      onChange([...selectedFields, field]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        언제 사용하시나요? (복수 선택 가능)
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {lensFields.map((field) => (
          <button
            key={field.value}
            onClick={() => toggleField(field.value)}
            className={`rounded-lg border-2 p-4 text-center transition-colors ${
              selectedFields.includes(field.value)
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
            }`}
          >
            {field.label}
          </button>
        ))}
      </div>
    </div>
  );
}


"use client";

import { PhotographyField, UserLevel } from "@/lib/types";

interface LevelBasedFieldSelectorProps {
  userLevel: UserLevel;
  selectedFields: PhotographyField[];
  onChange: (fields: PhotographyField[]) => void;
}

const professionalFields: { value: PhotographyField; label: string }[] = [
  { value: "commercial", label: "상업 촬영" },
  { value: "wedding", label: "웨딩" },
  { value: "studio", label: "스튜디오" },
  { value: "fashion", label: "패션" },
  { value: "product", label: "제품" },
];

const enthusiastFields: { value: PhotographyField; label: string }[] = [
  { value: "travel", label: "여행" },
  { value: "daily", label: "일상" },
  { value: "portrait", label: "인물" },
  { value: "landscape", label: "풍경" },
  { value: "street", label: "스트릿" },
];

const beginnerFields: { value: PhotographyField; label: string }[] = [
  { value: "general", label: "일반" },
  { value: "snapshot", label: "스냅샷" },
];

export default function LevelBasedFieldSelector({
  userLevel,
  selectedFields,
  onChange,
}: LevelBasedFieldSelectorProps) {
  const getFields = () => {
    switch (userLevel) {
      case "professional":
        return professionalFields;
      case "enthusiast":
        return enthusiastFields;
      case "beginner":
        return beginnerFields;
    }
  };

  const fields = getFields();

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
        촬영 분야를 선택해주세요 (복수 선택 가능)
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map((field) => (
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


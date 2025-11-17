"use client";

import { PhotographyField } from "@/lib/types";

interface PhotographyFieldSelectorProps {
  selectedFields: PhotographyField[];
  onChange: (fields: PhotographyField[]) => void;
}

const fieldLabels: Record<PhotographyField, string> = {
  portrait: "인물",
  travel: "여행",
  street: "거리 스냅",
  landscape: "풍경",
  lowlight: "저조도 / 야경",
  film: "필름 감성",
  video: "동영상 겸용",
};

export default function PhotographyFieldSelector({
  selectedFields,
  onChange,
}: PhotographyFieldSelectorProps) {
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {(Object.keys(fieldLabels) as PhotographyField[]).map((field) => (
          <button
            key={field}
            onClick={() => toggleField(field)}
            className={`rounded-lg border-2 p-4 text-center transition-colors ${
              selectedFields.includes(field)
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
            }`}
          >
            {fieldLabels[field]}
          </button>
        ))}
      </div>
    </div>
  );
}


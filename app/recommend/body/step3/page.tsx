"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { UserInput, PhotographyField } from "@/lib/types";

const fieldOptions: { value: PhotographyField; label: string }[] = [
  { value: "travel", label: "여행" },
  { value: "daily", label: "일상" },
  { value: "portrait", label: "인물" },
  { value: "landscape", label: "풍경" },
  { value: "street", label: "스트릿" },
];

export default function BodyStep3Page() {
  const router = useRouter();
  const [selectedFields, setSelectedFields] = useState<PhotographyField[]>([]);
  const [userInput, setUserInput] = useState<UserInput | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userInput");
    if (stored) {
      const parsed = JSON.parse(stored) as UserInput;
      if (parsed.recommendationType !== "body") {
        router.push("/");
        return;
      }
      setUserInput(parsed);
      if (parsed.photographyFields) {
        setSelectedFields(parsed.photographyFields);
      }
    } else {
      router.push("/recommend/body/step1");
    }
  }, [router]);

  const toggleField = (field: PhotographyField) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleNext = () => {
    if (selectedFields.length === 0 || !userInput) {
      alert("최소 하나 이상의 사용 분야를 선택해주세요.");
      return;
    }

    const updatedInput: UserInput = {
      ...userInput,
      photographyFields: selectedFields,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));
    router.push("/recommend/body/step4");
  };

  const handleBack = () => {
    router.push("/recommend/body/step2");
  };

  if (!userInput) {
    return <div className="min-h-screen bg-gray-50 p-4">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            언제 사용하시나요?
          </h1>
          <p className="text-gray-600">Step 3 of 5 (중복 선택 가능)</p>
        </div>

        <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              사용 분야를 선택해주세요
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fieldOptions.map((field) => (
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

          <div className="flex justify-end gap-4 pt-4">
            <Button onClick={handleBack} variant="outline">
              이전
            </Button>
            <Button onClick={handleNext} disabled={selectedFields.length === 0}>
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LensFieldSelector from "@/components/questionnaire/LensFieldSelector";
import Button from "@/components/ui/Button";
import { UserInput, PhotographyField } from "@/lib/types";

export default function LensStep3Page() {
  const router = useRouter();
  const [selectedFields, setSelectedFields] = useState<PhotographyField[]>([]);
  const [userInput, setUserInput] = useState<UserInput | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userInput");
    if (stored) {
      const parsed = JSON.parse(stored) as UserInput;
      if (parsed.recommendationType !== "lens") {
        router.push("/");
        return;
      }
      setUserInput(parsed);
      if (parsed.photographyFields) {
        setSelectedFields(parsed.photographyFields);
      }
    } else {
      router.push("/recommend/lens/step1");
    }
  }, [router]);

  const handleNext = () => {
    if (!userInput) return;

    if (selectedFields.length === 0) {
      alert("사용 분야를 최소 하나 선택해주세요.");
      return;
    }

    const updatedInput: UserInput = {
      ...userInput,
      photographyFields: selectedFields,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));
    router.push("/recommend/lens/step4");
  };

  const handleBack = () => {
    router.push("/recommend/lens/step2");
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
          <p className="text-gray-600">Step 3 of 5</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <LensFieldSelector
            selectedFields={selectedFields}
            onChange={setSelectedFields}
          />

          <div className="mt-8 flex justify-end gap-4">
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


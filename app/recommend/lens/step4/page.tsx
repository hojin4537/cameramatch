"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LensPriorityRanking from "@/components/questionnaire/LensPriorityRanking";
import Button from "@/components/ui/Button";
import { UserInput, LensPriorityOrder } from "@/lib/types";

const defaultLensPriorityOrder: LensPriorityOrder = {
  size: 1,
  weight: 2,
  price: 3,
  bokeh: 4,
  zoomRange: 5,
};

export default function LensStep4Page() {
  const router = useRouter();
  const [priorityOrder, setPriorityOrder] =
    useState<LensPriorityOrder>(defaultLensPriorityOrder);
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
      if (parsed.lensPriorityOrder) {
        setPriorityOrder(parsed.lensPriorityOrder);
      }
    } else {
      router.push("/recommend/lens/step1");
    }
  }, [router]);

  const handleNext = () => {
    if (!userInput) return;

    const updatedInput: UserInput = {
      ...userInput,
      lensPriorityOrder: priorityOrder,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));
    router.push("/recommend/lens/step5");
  };

  const handleBack = () => {
    router.push("/recommend/lens/step3");
  };

  if (!userInput) {
    return <div className="min-h-screen bg-gray-50 p-4">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            우선순위를 골라주세요
          </h1>
          <p className="text-gray-600">Step 4 of 5</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <LensPriorityRanking
            priorityOrder={priorityOrder}
            onChange={setPriorityOrder}
          />

          <div className="mt-8 flex justify-end gap-4">
            <Button onClick={handleBack} variant="outline">
              이전
            </Button>
            <Button onClick={handleNext}>다음</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


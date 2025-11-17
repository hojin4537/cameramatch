"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PriorityRanking from "@/components/questionnaire/PriorityRanking";
import Button from "@/components/ui/Button";
import { UserInput, PriorityOrder } from "@/lib/types";

const defaultPriorityOrder: PriorityOrder = {
  weight: 1,
  size: 2,
  sharpness: 3,
  convenience: 4,
  price: 5,
};

export default function BodyStep4Page() {
  const router = useRouter();
  const [priorityOrder, setPriorityOrder] =
    useState<PriorityOrder>(defaultPriorityOrder);
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
      if (parsed.priorityOrder) {
        setPriorityOrder(parsed.priorityOrder);
      }
    } else {
      router.push("/recommend/body/step1");
    }
  }, [router]);

  const handleNext = () => {
    if (!userInput) return;

    const updatedInput: UserInput = {
      ...userInput,
      priorityOrder: priorityOrder,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));
    router.push("/recommend/body/step5");
  };

  const handleBack = () => {
    router.push("/recommend/body/step3");
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
          <PriorityRanking
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


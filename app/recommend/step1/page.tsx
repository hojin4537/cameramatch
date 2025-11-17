"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhotographyFieldSelector from "@/components/questionnaire/PhotographyFieldSelector";
import BudgetSelector from "@/components/questionnaire/BudgetSelector";
import Button from "@/components/ui/Button";
import { PhotographyField, BudgetRange } from "@/lib/types";

export default function Step1Page() {
  const router = useRouter();
  const [selectedFields, setSelectedFields] = useState<PhotographyField[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | null>(null);

  const handleNext = () => {
    if (selectedFields.length === 0 || !selectedBudget) {
      alert("촬영 분야와 예산을 모두 선택해주세요.");
      return;
    }

    // Store in sessionStorage
    sessionStorage.setItem(
      "userInput",
      JSON.stringify({
        photographyFields: selectedFields,
        budgetRange: selectedBudget,
        ownedLenses: [],
      })
    );

    router.push("/recommend/step2");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            촬영 스타일과 예산을 알려주세요
          </h1>
          <p className="text-gray-600">Step 1 of 3</p>
        </div>

        <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm">
          <PhotographyFieldSelector
            selectedFields={selectedFields}
            onChange={setSelectedFields}
          />

          <BudgetSelector
            selectedBudget={selectedBudget}
            onChange={setSelectedBudget}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button href="/" variant="outline">
              취소
            </Button>
            <Button onClick={handleNext} disabled={selectedFields.length === 0 || !selectedBudget}>
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


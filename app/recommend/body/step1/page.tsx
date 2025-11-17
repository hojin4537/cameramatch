"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BudgetInput from "@/components/questionnaire/BudgetInput";
import Button from "@/components/ui/Button";

export default function BodyStep1Page() {
  const router = useRouter();
  const [budget, setBudget] = useState<number | null>(null);

  const handleNext = () => {
    if (!budget) {
      alert("예산을 선택해주세요.");
      return;
    }

    // Store in sessionStorage
    sessionStorage.setItem(
      "userInput",
      JSON.stringify({
        recommendationType: "body",
        budget: budget,
      })
    );

    router.push("/recommend/body/step2");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold text-white">
                C
              </div>
              <span className="text-lg font-semibold text-gray-900">CameraMatch</span>
            </Link>
            <div className="text-sm text-gray-500">Step 1 of 5</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            바디 추천을 위한 정보 입력
          </h1>
          <p className="text-gray-600">예산을 입력해주세요</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <BudgetInput budget={budget} onChange={setBudget} />

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
            <Button href="/" variant="outline">
              취소
            </Button>
            <Button onClick={handleNext} disabled={!budget}>
              다음
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

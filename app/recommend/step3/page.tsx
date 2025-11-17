"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrioritySlider from "@/components/questionnaire/PrioritySlider";
import Button from "@/components/ui/Button";
import { UserInput, PriorityWeights } from "@/lib/types";

const defaultWeights: PriorityWeights = {
  portability: 3,
  sharpness: 4,
  bokeh: 3,
  lowLight: 3,
  afSpeed: 3,
  price: 3,
  versatility: 3,
  color: 3,
};

export default function Step3Page() {
  const router = useRouter();
  const [weights, setWeights] = useState<PriorityWeights>(defaultWeights);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("userInput");
    if (stored) {
      const parsed = JSON.parse(stored) as UserInput;
      setUserInput(parsed);
    } else {
      router.push("/recommend/step1");
    }
  }, [router]);

  const handleGetRecommendations = async () => {
    if (!userInput) return;

    setLoading(true);

    // Store weights
    sessionStorage.setItem("priorityWeights", JSON.stringify(weights));
    sessionStorage.setItem("userInput", JSON.stringify(userInput));

    // Navigate to result page
    router.push("/recommend/result");
  };

  const handleBack = () => {
    router.push("/recommend/step2");
  };

  if (!userInput) {
    return <div className="min-h-screen bg-gray-50 p-4">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            우선순위를 설정해주세요
          </h1>
          <p className="text-gray-600">Step 3 of 3</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <PrioritySlider weights={weights} onChange={setWeights} />

          <div className="mt-8 flex justify-end gap-4">
            <Button onClick={handleBack} variant="outline">
              이전
            </Button>
            <Button onClick={handleGetRecommendations} disabled={loading}>
              {loading ? "처리 중..." : "추천 받기"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


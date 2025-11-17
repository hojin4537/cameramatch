"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserInput, RecommendationResult } from "@/lib/types";
import { getRecommendations } from "@/lib/recommendation";
import RecommendationCard from "@/components/recommendation/RecommendationCard";
import PerformanceChart from "@/components/recommendation/PerformanceChart";
import CombinationEvaluation from "@/components/recommendation/CombinationEvaluation";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function LensResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecommendations() {
      const userInputStr = sessionStorage.getItem("userInput");

      if (!userInputStr) {
        router.push("/recommend/lens/step1");
        return;
      }

      try {
        const userInput = JSON.parse(userInputStr) as UserInput;
        if (userInput.recommendationType !== "lens") {
          router.push("/");
          return;
        }

        // 렌즈 추천은 priorityOrder가 필요 없음
        const recommendations = await getRecommendations(userInput);
        setResult(recommendations);
      } catch (err) {
        console.error("Error loading recommendations:", err);
        setError("추천 결과를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [router]);

  const handleRestart = () => {
    sessionStorage.clear();
    router.push("/recommend/lens/step1");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <div className="mt-4 text-lg font-semibold text-gray-900">
            추천 결과를 생성하는 중...
          </div>
          <div className="mt-2 text-gray-600">잠시만 기다려주세요</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-red-600">{error}</div>
          <Button onClick={handleRestart}>다시 시작하기</Button>
        </div>
      </div>
    );
  }

  if (!result || result.topRecommendations.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-gray-900">
            추천 결과가 없습니다
          </div>
          <Button onClick={handleRestart}>다시 시작하기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            렌즈 추천 결과
          </h1>
          <p className="text-gray-600">
            당신에게 가장 적합한 후지필름 렌즈를 추천합니다
          </p>
        </div>

        <div className="space-y-8">
          {result.topRecommendations.map((recommendation, index) => (
            <div key={recommendation.id} className="space-y-4">
              <RecommendationCard
                recommendation={recommendation}
                index={index}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <PerformanceChart recommendation={recommendation} />
                {result.combinationEvaluations[index] && (
                  <CombinationEvaluation
                    evaluation={result.combinationEvaluations[index]}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button onClick={handleRestart} variant="primary">
            다시 검색하기
          </Button>
        </div>
      </div>
    </div>
  );
}


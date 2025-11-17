"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { UserInput } from "@/lib/types";

export default function LensStep5Page() {
  const router = useRouter();
  const [newProductOnly, setNewProductOnly] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("userInput");
    if (stored) {
      const parsed = JSON.parse(stored) as UserInput;
      if (parsed.recommendationType !== "lens") {
        router.push("/");
        return;
      }
      setUserInput(parsed);
      if (parsed.newProductOnly !== undefined) {
        setNewProductOnly(parsed.newProductOnly);
      }
    } else {
      router.push("/recommend/lens/step1");
    }
  }, [router]);

  const handleGetRecommendations = async () => {
    if (!userInput) return;

    setLoading(true);

    const updatedInput: UserInput = {
      ...userInput,
      newProductOnly: newProductOnly,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));

    // Navigate to result page
    router.push("/recommend/lens/result");
  };

  const handleBack = () => {
    router.push("/recommend/lens/step4");
  };

  if (!userInput) {
    return <div className="min-h-screen bg-gray-50 p-4">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            추가 질문
          </h1>
          <p className="text-gray-600">Step 5 of 5</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="newProductOnly"
                checked={newProductOnly}
                onChange={(e) => setNewProductOnly(e.target.checked)}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900"
              />
              <label
                htmlFor="newProductOnly"
                className="cursor-pointer text-lg font-semibold text-gray-900"
              >
                새것만 찾으시나요?
              </label>
            </div>
            <p className="text-sm text-gray-600">
              체크하지 않으면 새것과 중고 모두 검색 결과에 포함됩니다.
            </p>
          </div>

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


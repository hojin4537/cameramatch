"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsageSelector from "@/components/questionnaire/UsageSelector";
import Button from "@/components/ui/Button";
import { UserInput, UsageType } from "@/lib/types";

export default function LensStep2Page() {
  const router = useRouter();
  const [usageType, setUsageType] = useState<UsageType | null>(null);
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
      if (parsed.usageType) {
        setUsageType(parsed.usageType);
      }
    } else {
      router.push("/recommend/lens/step1");
    }
  }, [router]);

  const handleNext = () => {
    if (!usageType || !userInput) {
      alert("용도를 선택해주세요.");
      return;
    }

    const updatedInput: UserInput = {
      ...userInput,
      usageType: usageType,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));
    router.push("/recommend/lens/step3");
  };

  const handleBack = () => {
    router.push("/recommend/lens/step1");
  };

  if (!userInput) {
    return <div className="min-h-screen bg-gray-50 p-4">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            용도를 선택해주세요
          </h1>
          <p className="text-gray-600">Step 2 of 5</p>
        </div>

        <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm">
          <UsageSelector selectedUsage={usageType} onChange={setUsageType} />

          <div className="flex justify-end gap-4 pt-4">
            <Button onClick={handleBack} variant="outline">
              이전
            </Button>
            <Button onClick={handleNext} disabled={!usageType}>
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


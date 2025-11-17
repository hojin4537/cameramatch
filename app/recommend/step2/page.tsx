"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OwnedGearInput from "@/components/questionnaire/OwnedGearInput";
import Button from "@/components/ui/Button";
import { UserInput } from "@/lib/types";

export default function Step2Page() {
  const router = useRouter();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedLenses, setSelectedLenses] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<UserInput | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userInput");
    if (stored) {
      const parsed = JSON.parse(stored) as UserInput;
      setUserInput(parsed);
      setSelectedCamera(parsed.ownedCamera || null);
      setSelectedLenses(parsed.ownedLenses || []);
    } else {
      router.push("/recommend/step1");
    }
  }, [router]);

  const handleNext = () => {
    if (!userInput) return;

    const updatedInput: UserInput = {
      ...userInput,
      ownedCamera: selectedCamera || undefined,
      ownedLenses: selectedLenses,
    };

    sessionStorage.setItem("userInput", JSON.stringify(updatedInput));
    router.push("/recommend/step3");
  };

  const handleBack = () => {
    router.push("/recommend/step1");
  };

  if (!userInput) {
    return <div className="min-h-screen bg-gray-50 p-4">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            보유 장비를 알려주세요
          </h1>
          <p className="text-gray-600">Step 2 of 3</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <OwnedGearInput
            selectedCamera={selectedCamera}
            selectedLenses={selectedLenses}
            onCameraChange={setSelectedCamera}
            onLensesChange={setSelectedLenses}
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


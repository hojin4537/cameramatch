"use client";

import { useEffect, useState } from "react";
import { Camera, Lens, Mount } from "@/lib/types";
import { getCameras, getLenses, getLensesByMount } from "@/lib/db";

interface OwnedGearInputProps {
  selectedCamera: string | null;
  selectedLenses: string[];
  onCameraChange: (cameraId: string | null) => void;
  onLensesChange: (lensIds: string[]) => void;
}

export default function OwnedGearInput({
  selectedCamera,
  selectedLenses,
  onCameraChange,
  onLensesChange,
}: OwnedGearInputProps) {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [camerasData, lensesData] = await Promise.all([
        getCameras(),
        getLenses(),
      ]);
      setCameras(camerasData);
      setLenses(lensesData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function filterLenses() {
      if (selectedCamera) {
        const camera = cameras.find((c) => c.id === selectedCamera);
        if (camera) {
          const filteredLenses = await getLensesByMount(camera.mount);
          setLenses(filteredLenses);
          // Clear selected lenses if they're not compatible
          const compatibleLensIds = filteredLenses.map((l) => l.id);
          onLensesChange(
            selectedLenses.filter((id) => compatibleLensIds.includes(id))
          );
        }
      } else {
        const allLenses = await getLenses();
        setLenses(allLenses);
      }
    }
    if (cameras.length > 0) {
      filterLenses();
    }
  }, [selectedCamera, cameras]);

  const toggleLens = (lensId: string) => {
    if (selectedLenses.includes(lensId)) {
      onLensesChange(selectedLenses.filter((id) => id !== lensId));
    } else {
      onLensesChange([...selectedLenses, lensId]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
        <span className="ml-3 text-gray-600">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          보유 카메라 바디 (선택사항)
        </h3>
        <select
          value={selectedCamera || ""}
          onChange={(e) => onCameraChange(e.target.value || null)}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none"
        >
          <option value="">없음</option>
          {cameras.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.brand} {camera.model}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          보유 렌즈 (복수 선택 가능, 선택사항)
        </h3>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-gray-300 p-4">
          {lenses.length === 0 ? (
            <p className="text-center text-gray-500">
              {selectedCamera
                ? "이 마운트에 호환되는 렌즈가 없습니다."
                : "렌즈를 불러오는 중..."}
            </p>
          ) : (
            lenses.map((lens) => (
              <label
                key={lens.id}
                className="flex cursor-pointer items-center space-x-3 rounded-lg p-3 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedLenses.includes(lens.id)}
                  onChange={() => toggleLens(lens.id)}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-gray-900">
                  {lens.brand} {lens.model} ({lens.focalLength}, {lens.aperture})
                </span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


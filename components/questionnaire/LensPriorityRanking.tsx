"use client";

import { useState } from "react";
import { LensPriorityOrder } from "@/lib/types";

interface LensPriorityRankingProps {
  priorityOrder: LensPriorityOrder;
  onChange: (order: LensPriorityOrder) => void;
}

type LensPriorityKey = keyof LensPriorityOrder;

const priorityItems: { key: LensPriorityKey; label: string }[] = [
  { key: "size", label: "크기" },
  { key: "weight", label: "무게" },
  { key: "price", label: "가격" },
  { key: "bokeh", label: "아웃포커싱" },
  { key: "zoomRange", label: "줌 범위" },
];

export default function LensPriorityRanking({
  priorityOrder,
  onChange,
}: LensPriorityRankingProps) {
  const [draggedItem, setDraggedItem] = useState<LensPriorityKey | null>(null);
  const [dragOverItem, setDragOverItem] = useState<LensPriorityKey | null>(null);

  const moveUp = (key: LensPriorityKey) => {
    const currentRank = priorityOrder[key];
    if (currentRank <= 1) return;

    const newOrder = { ...priorityOrder };
    // 현재 항목과 위 항목의 순위 교환
    const swapKey = Object.keys(priorityOrder).find(
      (k) => priorityOrder[k as LensPriorityKey] === currentRank - 1
    ) as LensPriorityKey;

    if (swapKey) {
      newOrder[key] = currentRank - 1;
      newOrder[swapKey] = currentRank;
      onChange(newOrder);
    }
  };

  const moveDown = (key: LensPriorityKey) => {
    const currentRank = priorityOrder[key];
    if (currentRank >= 5) return;

    const newOrder = { ...priorityOrder };
    // 현재 항목과 아래 항목의 순위 교환
    const swapKey = Object.keys(priorityOrder).find(
      (k) => priorityOrder[k as LensPriorityKey] === currentRank + 1
    ) as LensPriorityKey;

    if (swapKey) {
      newOrder[key] = currentRank + 1;
      newOrder[swapKey] = currentRank;
      onChange(newOrder);
    }
  };

  const handleDragStart = (e: React.DragEvent, key: LensPriorityKey) => {
    setDraggedItem(key);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, key: LensPriorityKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedItem && draggedItem !== key) {
      setDragOverItem(key);
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetKey: LensPriorityKey) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetKey) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedRank = priorityOrder[draggedItem];
    const targetRank = priorityOrder[targetKey];

    const newOrder = { ...priorityOrder };
    newOrder[draggedItem] = targetRank;
    newOrder[targetKey] = draggedRank;

    onChange(newOrder);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 순위별로 정렬
  const sortedItems = [...priorityItems].sort(
    (a, b) => priorityOrder[a.key] - priorityOrder[b.key]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        우선순위를 순서대로 정해주세요
      </h3>
      <p className="text-sm text-gray-600">
        항목을 드래그하여 순서를 변경하거나, 위/아래 버튼을 사용할 수 있습니다.
      </p>

      <div className="space-y-2">
        {sortedItems.map((item, index) => (
          <div
            key={item.key}
            draggable
            onDragStart={(e) => handleDragStart(e, item.key)}
            onDragOver={(e) => handleDragOver(e, item.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.key)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-3 rounded-lg border-2 bg-white p-4 transition-all ${
              draggedItem === item.key
                ? "border-blue-500 bg-blue-50 opacity-50"
                : dragOverItem === item.key
                ? "border-green-500 bg-green-50"
                : "border-gray-200"
            } cursor-move`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
              {priorityOrder[item.key]}
            </div>
            <div className="flex flex-1 items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
              <div className="font-semibold text-gray-900">{item.label}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveUp(item.key)}
                disabled={priorityOrder[item.key] === 1}
                className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={() => moveDown(item.key)}
                disabled={priorityOrder[item.key] === 5}
                className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


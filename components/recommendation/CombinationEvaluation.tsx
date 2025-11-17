import { CombinationEvaluation as CombinationEvaluationType } from "@/lib/types";

interface CombinationEvaluationProps {
  evaluation: CombinationEvaluationType;
}

export default function CombinationEvaluation({
  evaluation,
}: CombinationEvaluationProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm text-gray-900">{evaluation.evaluation}</p>
      {evaluation.warning && (
        <p className="mt-2 text-sm font-semibold text-amber-600">
          ⚠️ {evaluation.warning}
        </p>
      )}
    </div>
  );
}


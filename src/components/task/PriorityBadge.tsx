export function PriorityBadge({ priority }: { priority: string }) {
  // ✨ Clean, forced light-mode pastel colors
  const colorMap: Record<string, string> = {
    "High Priority": "bg-red-50 text-red-700 border border-red-100",
    "Medium Priority": "bg-amber-50 text-amber-700 border border-amber-100",
    "Low Priority": "bg-blue-50 text-blue-700 border border-blue-100",
  };

  const colors = colorMap[priority] || "bg-gray-50 text-gray-600 border border-gray-200";

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${colors}`}>
      {priority}
    </span>
  );
}
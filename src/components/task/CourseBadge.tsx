export function CourseBadge({ course }: { course: string | null }) {
  if (!course) return null;

  return (
    // ✨ Forced light-mode crisp gray
    <span className="px-2.5 py-0.5 rounded-md bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200">
      📚 {course}
    </span>
  );
}
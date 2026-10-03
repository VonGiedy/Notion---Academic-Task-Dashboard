import { AcademicTaskPage } from "../types/notion";
import { Task, TaskPriority } from "../types/task";

export function extractPlainText(
  richText?: { plain_text: string }[] | null
): string {
  if (!richText || richText.length === 0) return "";
  return richText.map((item) => item.plain_text).join("");
}

export function isAcademicTaskPage(page: AcademicTaskPage): boolean {
  const projectCount = page.properties.Project?.relation?.length ?? 0;
  const healthGoalCount = page.properties["Health Goal"]?.relation?.length ?? 0;
  return projectCount === 0 && healthGoalCount === 0;
}

export function mapNotionPageToTask(
  page: AcademicTaskPage,
  courseName: string | null
): Task {
  const props = page.properties;

  const title =
    props.Task?.title?.[0]?.plain_text ||
    extractPlainText(props.Task?.title) ||
    "Untitled";

  const deadlineStr = props.Deadline?.date?.start;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  const priority =
    (props.Priority?.select?.name as TaskPriority) ?? "No Priority";

  const completed = props.Checkbox?.checkbox ?? false;

  const description = extractPlainText(props.Description?.rich_text);

  return {
    id: page.id,
    title,
    deadline,
    priority,
    completed,
    description,
    course: courseName,
  };
}

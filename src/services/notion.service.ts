import { isFullPage } from "@notionhq/client";
import { notion, NOTION_CONFIG } from "../lib/notion";
import { AcademicTaskPage } from "../types/notion";
import { Task } from "../types/task";
import { isAcademicTaskPage, mapNotionPageToTask } from "../lib/taskMapper";

// Cache in-flight and resolved course names to prevent redundant concurrent fetches
const courseCache = new Map<string, Promise<string>>();

export async function getCourseName(pageId: string): Promise<string> {
  const existingPromise = courseCache.get(pageId);
  if (existingPromise) {
    return existingPromise;
  }

  const fetchPromise = (async () => {
    try {
      const response = await notion.pages.retrieve({ page_id: pageId });
      if (!isFullPage(response)) {
        return "Unknown Course";
      }

      const courseTitleProp = response.properties["Course Name"];
      if (courseTitleProp && courseTitleProp.type === "title") {
        return courseTitleProp.title[0]?.plain_text ?? "Unknown Course";
      }

      return "Unknown Course";
    } catch (error) {
      console.error(`[Notion] Failed to fetch course ${pageId}:`, error);
      return "Unknown Course";
    }
  })();

  courseCache.set(pageId, fetchPromise);
  return fetchPromise;
}

export async function getAcademicTasks(): Promise<Task[]> {
  const dataSourceId = NOTION_CONFIG.dataSourceId;
  if (!dataSourceId) {
    console.error("[Notion] Error: NOTION_DATA_SOURCE_ID is not configured.");
    return [];
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    // Keep only full page objects
    const fullPages = response.results.filter(isFullPage) as unknown as AcademicTaskPage[];

    // Filter for academic tasks first before requesting course relations to save unnecessary API calls
    const academicPages = fullPages.filter(isAcademicTaskPage);

    const tasks = await Promise.all(
      academicPages.map(async (page) => {
        const courseRelationId = page.properties.Courses?.relation?.[0]?.id;
        const courseName = courseRelationId
          ? await getCourseName(courseRelationId)
          : null;

        return mapNotionPageToTask(page, courseName);
      })
    );

    // Filter out Non-Academic courses if marked as such
    return tasks.filter((task) => task.course !== "Non-Academic");
  } catch (error) {
    console.error("[Notion] Error fetching academic tasks:", error);
    return [];
  }
}
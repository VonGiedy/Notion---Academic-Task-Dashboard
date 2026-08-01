import { notion } from "../lib/notion";
import { Task } from "../types/task";


const courseCache = new Map<string, string>();


async function getCourseName(pageId: string): Promise<string> {
  if (courseCache.has(pageId)) {
    return courseCache.get(pageId)!;
  }

  try {
    const response: any = await notion.pages.retrieve({ page_id: pageId });
    

    const courseName = response.properties["Course Name"]?.title[0]?.plain_text ?? "Unknown Course";

    courseCache.set(pageId, courseName);
    return courseName;
  } catch (error) {
    console.error(`Failed to fetch course ${pageId}:`, error);
    return "Unknown Course";
  }
}

export async function getAcademicTasks(): Promise<Task[]> {
  const response: any = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATA_SOURCE_ID!,
  });


  const rawTasks = await Promise.all(
    response.results.map(async (page: any) => {
  
      const courseRelationId = page.properties.Courses.relation[0]?.id;
      

      const courseName = courseRelationId
        ? await getCourseName(courseRelationId)
        : null;

      return {
        id: page.id,
        title: page.properties.Task.title[0]?.plain_text ?? "Untitled",
        deadline: page.properties.Deadline.date
          ? new Date(page.properties.Deadline.date.start)
          : null,
        priority: page.properties.Priority.select?.name ?? "No Priority",
        completed: page.properties.Checkbox.checkbox,
        description: page.properties.Description.rich_text
          .map((text: any) => text.plain_text)
          .join(""),
        
   
        course: courseName,
        

        _projectCount: page.properties.Project?.relation?.length || 0,
        _healthGoalCount: page.properties["Health Goal"]?.relation?.length || 0,
      };
    })
  );


  const academicTasks = rawTasks
    .filter((task) => task._projectCount === 0)
    .filter((task) => task._healthGoalCount === 0)
    .filter((task) => task.course !== "Non-Academic")
    .map(({ _projectCount, _healthGoalCount, ...task }) => task as Task);

  return academicTasks;
}
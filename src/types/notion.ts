import type { PageObjectResponse, QueryDataSourceResponse } from "@notionhq/client";

export type NotionPage = PageObjectResponse;
export type NotionQueryResult = QueryDataSourceResponse["results"][number];

export type TitleProperty = Extract<PageObjectResponse["properties"][string], { type: "title" }>;
export type DateProperty = Extract<PageObjectResponse["properties"][string], { type: "date" }>;
export type SelectProperty = Extract<PageObjectResponse["properties"][string], { type: "select" }>;
export type CheckboxProperty = Extract<PageObjectResponse["properties"][string], { type: "checkbox" }>;
export type RichTextProperty = Extract<PageObjectResponse["properties"][string], { type: "rich_text" }>;
export type RelationProperty = Extract<PageObjectResponse["properties"][string], { type: "relation" }>;

export interface AcademicTaskProperties {
  Task?: TitleProperty;
  Deadline?: DateProperty;
  Priority?: SelectProperty;
  Checkbox?: CheckboxProperty;
  Description?: RichTextProperty;
  Courses?: RelationProperty;
  Project?: RelationProperty;
  "Health Goal"?: RelationProperty;
  "Course Name"?: TitleProperty;
  [key: string]: PageObjectResponse["properties"][string] | undefined;
}

export interface AcademicTaskPage extends Omit<PageObjectResponse, "properties"> {
  properties: AcademicTaskProperties;
}

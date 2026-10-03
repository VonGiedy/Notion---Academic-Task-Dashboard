import { Client } from "@notionhq/client";

const notionToken = process.env.NOTION_TOKEN;

if (!notionToken && process.env.NODE_ENV !== "production") {
  console.warn(
    "[Notion] Warning: NOTION_TOKEN is not defined in your environment variables. Ensure .env.local is configured."
  );
}

// Preserve a single client instance across Next.js hot reloads in development
const globalForNotion = globalThis as unknown as {
  notion: Client | undefined;
};

export const notion =
  globalForNotion.notion ??
  new Client({
    auth: notionToken,
  });

if (process.env.NODE_ENV !== "production") {
  globalForNotion.notion = notion;
}

export const NOTION_CONFIG = {
  token: notionToken,
  dataSourceId: process.env.NOTION_DATA_SOURCE_ID,
  coursesDatabaseId: process.env.NOTION_COURSES_DATABASE_ID,
} as const;

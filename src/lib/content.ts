import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { contentDefaults, type Content, type ContentKey } from "@/lib/content-defaults";

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Saved values override defaults field by field; lists are replaced as a whole
function merge<T>(defaults: T, saved: unknown): T {
  if (isObject(defaults) && isObject(saved)) {
    const result: Json = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (key in saved) result[key] = merge((defaults as Json)[key], saved[key]);
    }
    return result as T;
  }
  if (Array.isArray(defaults)) return (Array.isArray(saved) ? saved : defaults) as T;
  return (saved === undefined || saved === null ? defaults : saved) as T;
}

// cache() de-duplicates reads within a single request (e.g. layout + page both need settings)
export const getContent = cache(async <K extends ContentKey>(key: K): Promise<Content<K>> => {
  const row = await db.setting.findUnique({ where: { key } });
  return merge(contentDefaults[key], row?.value);
});

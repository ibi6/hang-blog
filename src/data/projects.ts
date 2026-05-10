import type { Project } from "../types/project";
import projectsData from "./projects.json";

/**
 * 项目数据（由 Decap CMS 管理 `projects.json`）。
 *
 * Decap 在保存文件集合 + list widget 时会写成
 *   { "projects": [...] }
 * 历史上我们也用过裸数组 [...]。两种形态都兼容。
 *
 * 按 `order` 升序（未提供时视作 +Infinity，沉底）。
 */
function extractArray(raw: unknown): Project[] {
  if (Array.isArray(raw)) return raw as Project[];
  if (
    raw !== null &&
    typeof raw === "object" &&
    Array.isArray((raw as { projects?: unknown }).projects)
  ) {
    return (raw as { projects: Project[] }).projects;
  }
  return [];
}

export const projects: Project[] = extractArray(projectsData)
  .slice()
  .sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    return ao - bo;
  });

import type { Author } from "../types/author";
import authorData from "./author.json";

/**
 * 作者数据（由 Decap CMS 管理 `author.json`）。
 * 这里只做类型收敛，真实内容都在 JSON 里，方便后台编辑。
 */
export const author: Author = authorData as Author;

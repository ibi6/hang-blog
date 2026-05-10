/**
 * Feature: personal-portfolio-blog
 * Pagination helper with boundary clamping per design.md Property 5.
 */

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
}

/**
 * Paginate an array with the following semantics (see design.md Property 5):
 *
 * - `totalPages = max(1, ceil(items.length / perPage))`. Empty input still
 *   yields `totalPages === 1`.
 * - `total === items.length`.
 * - When `page < 1`, clamps up to 1 and returns the items for page 1.
 * - When `page > totalPages`, returns an empty `items` array and sets `page`
 *   to `totalPages`. This matches the design's strict reading of condition (e):
 *   out-of-range pages produce empty items rather than silently returning the
 *   last page's items.
 * - `perPage` is clamped to a minimum of 1.
 */
export function paginate<T>(
  items: T[],
  page: number,
  perPage: number,
): Page<T> {
  const safePerPage = perPage < 1 ? 1 : Math.floor(perPage);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  // Clamp page into [1, totalPages]. Out-of-upper-bound returns empty items
  // with page = totalPages (see condition (e)).
  if (page < 1) {
    const clamped = 1;
    const start = 0;
    const end = Math.min(safePerPage, total);
    return {
      items: items.slice(start, end),
      page: clamped,
      totalPages,
      total,
    };
  }

  if (page > totalPages) {
    return {
      items: [],
      page: totalPages,
      totalPages,
      total,
    };
  }

  const start = (page - 1) * safePerPage;
  const end = Math.min(start + safePerPage, total);
  return {
    items: items.slice(start, end),
    page,
    totalPages,
    total,
  };
}

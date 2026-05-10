/**
 * Feature: personal-portfolio-blog
 * Date-descending sort for items with a frontmatter.date string.
 */

/**
 * Sort items by `frontmatter.date` in descending order.
 *
 * - Non-mutating: returns a new array, leaves input untouched.
 * - Stable: relative order of equal-date items matches the input.
 *
 * Dates are compared lexicographically. ISO 8601 strings (YYYY-MM-DD or
 * full ISO) sort correctly under lexicographic comparison.
 */
export function sortByDateDesc<T extends { frontmatter: { date: string } }>(
  items: T[],
): T[] {
  // Decorate with original index to guarantee stability.
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ad = a.item.frontmatter.date;
      const bd = b.item.frontmatter.date;
      if (ad < bd) return 1;
      if (ad > bd) return -1;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

/**
 * Date and number formatting for content data.
 * Dates in src/data are "YYYY-MM" strings; null means "Present".
 * Month names are fixed English (not Intl) so output never varies by build machine.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parse(ym: string): { year: number; month: number } {
  const [year, month] = ym.split('-').map(Number);
  return { year, month };
}

/** "2026-04" → "Apr 2026"; null → "Present" */
export function formatMonth(ym: string | null): string {
  if (ym === null) return 'Present';
  const { year, month } = parse(ym);
  return `${MONTHS[month - 1]} ${year}`;
}

/** ("2026-04", "2026-07") → "Apr 2026 – Jul 2026"; ("2026-04", null) → "Apr 2026 – Present" */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

/** ("2022-09", "2026-09") → "2022–2026"; ("2022-09", null) → "2022–Present" */
export function formatYearRange(start: string, end: string | null): string {
  return `${parse(start).year}–${end === null ? 'Present' : parse(end).year}`;
}

/** "2022-12" → "22" (two-digit year, used in certification StatPills) */
export function shortYear(ym: string): string {
  return String(parse(ym).year % 100).padStart(2, '0');
}

/** 3 → "03" */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

/**
 * Small helpers for rendering site-wide data (src/data/site.json).
 */
/** "John Lexter" → "JL" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** True while a URL in the data still holds its placeholder (hide those links). */
export function isPlaceholderUrl(url: string): boolean {
  return url.includes('REPLACE_ME');
}

/** Where the "Download CV" button points: the PDF when set, otherwise the /cv page. */
export function cvHref(cvPdf: string | null): { href: string; download: boolean } {
  return cvPdf ? { href: cvPdf, download: true } : { href: '/cv', download: false };
}

/** "Mandaluyong City, Philippines" → "Mandaluyong City" */
export function city(location: string): string {
  return location.split(',')[0].trim();
}

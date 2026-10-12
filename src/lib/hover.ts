/**
 * Hover treatments from _effects.scss, exposed to components as a prop:
 *
 *   <StatPill hover="fill-dark" />   // black pill with white text
 *   <InfoTile hover="ring" />        // white tile
 *
 * - fill       → .hf          holo fill (filled elements with dark text)
 * - fill-dark  → .hf .hf-dark holo fill + text turns ink (white-text elements)
 * - ring       → .hr          holo outline (white elements)
 * - none       → no hover effect
 */
export type Hover = 'fill' | 'fill-dark' | 'ring' | 'none';

const classes: Record<Hover, string> = {
  fill: 'hf',
  'fill-dark': 'hf hf-dark',
  ring: 'hr',
  none: '',
};

export function hoverClass(hover: Hover = 'none'): string {
  return classes[hover];
}

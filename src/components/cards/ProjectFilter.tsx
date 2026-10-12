import { useEffect, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import s from './ProjectFilter.module.scss';

type Props = {
  /** id of the <ul> holding the cards; each <li> carries data-category. */
  gridId: string;
  categories: string[];
  label: string;
  allLabel: string;
  /** "{shown}" and "{total}" are replaced. */
  countText: string;
  total: number;
};

const ALL = '__all';

/**
 * Category filter for /projects (shadcn ToggleGroup styled as pills).
 * The cards themselves are static Astro HTML; this island only toggles
 * `hidden` on them, so without JS every project is simply shown.
 * Hydrate with client:visible.
 */
export default function ProjectFilter({ gridId, categories, label, allLabel, countText, total }: Props) {
  const [value, setValue] = useState(ALL);
  const [shown, setShown] = useState(total);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(`#${gridId} > [data-category]`);
    let count = 0;
    items.forEach((el) => {
      const match = value === ALL || el.dataset.category === value;
      el.hidden = !match;
      if (match) count++;
    });
    setShown(count);
  }, [value, gridId]);

  const options = [{ value: ALL, label: allLabel }, ...categories.map((c) => ({ value: c, label: c }))];

  return (
    <div className={s.filter}>
      <ToggleGroup
        type="single"
        value={value}
        // Radix allows deselecting a single toggle; keep one always on.
        onValueChange={(v) => v && setValue(v)}
        aria-label={label}
        className={s.group}
      >
        {options.map((o) => (
          <ToggleGroupItem
            key={o.value}
            value={o.value}
            className={`${s.pill} ${value === o.value ? 'hf hf-dark' : 'hr'}`}
          >
            {o.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className={s.count} role="status">
        {countText.replace('{shown}', String(shown)).replace('{total}', String(total))}
      </p>
    </div>
  );
}

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountUp from '@/components/game/CountUp';
import s from './PlayerCard.module.scss';

type Row = { label: string; value: number | string };

type Props = {
  monogram: string;
  section: string;
  className: string;
  level: { label: string; value: number; max: number };
  tabs: { stats: string; ability: string };
  stats: Row[];
  abilities: { label: string; detail: string }[];
  loadout: { label: string; href: string };
};

type Tab = 'stats' | 'ability';

/**
 * PlayerCard — the "character" card in About: lime header with class and
 * level, then Stats / Ability tabs (shadcn Tabs, so arrow keys, Home/End and
 * roving focus come from Radix). The active tab's lime background slides
 * between the two tabs. Hydrate with client:visible.
 */
export default function PlayerCard({ monogram, section, className, level, tabs, stats, abilities, loadout }: Props) {
  const [tab, setTab] = useState<Tab>('stats');
  const pct = Math.min(100, Math.round((level.value / level.max) * 100));

  return (
    <article className={`${s.card} hr`} aria-label={`${className} — player card`}>
      <span className={s.mono} aria-hidden="true">
        {monogram}
      </span>

      <header className={s.head}>
        <p className={s.section}>{section}</p>
        <p className={s.cls}>
          {className}
          <span className={s.bang} aria-hidden="true">
            !
          </span>
        </p>
        <span className={s.diamonds} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <p className={s.level}>
          {level.label} Lv. {level.value} / {level.max}
        </p>
        <span
          className={s.bar}
          role="progressbar"
          aria-label={`${level.label} level`}
          aria-valuenow={level.value}
          aria-valuemin={0}
          aria-valuemax={level.max}
        >
          <span style={{ width: `${pct}%` }} />
        </span>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className={s.tabs}>
        <TabsList className={s.list} data-active={tab}>
          <span className={s.indicator} aria-hidden="true" />
          {(['stats', 'ability'] as const).map((value, i) => (
            <TabsTrigger
              key={value}
              value={value}
              data-side={i === 0 ? 'start' : 'end'}
              className={`${s.trigger} hf ${tab === value ? '' : 'hf-dark'}`}
            >
              {tabs[value]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="stats" className={s.panel}>
          <dl className={s.rows}>
            {stats.map((row) => (
              <div key={row.label} className={s.row}>
                <dt>{row.label}</dt>
                <dd>{typeof row.value === 'number' ? <CountUp value={row.value} /> : row.value}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>

        <TabsContent value="ability" className={s.panel}>
          <dl className={s.rows}>
            {abilities.map((row) => (
              <div key={row.label} className={s.row}>
                <dt>{row.label}</dt>
                <dd className={s.detail}>{row.detail}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
      </Tabs>

      <a href={loadout.href} className={`${s.loadout} hf`}>
        {loadout.label}
      </a>
    </article>
  );
}

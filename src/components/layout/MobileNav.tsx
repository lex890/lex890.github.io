import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ActionButton from '@/components/game/ActionButton';
import s from './MobileNav.module.scss';

type Item = { label: string; href: string; spy: string | null; current: boolean };

type Props = {
  name: string;
  menuLabel: string;
  items: Item[];
  cv: { label: string; href: string; download: boolean };
  className?: string;
};

/**
 * Mobile menu (< 768px): a button that opens a shadcn Sheet with the same
 * nav pills as the desktop bar. The active section comes from the Header's
 * scroll-spy script (<html data-section> + "sectionchange" event).
 * Hydrate with client:media so desktop never loads it.
 */
export default function MobileNav({ name, menuLabel, items, cv, className }: Props) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('');

  useEffect(() => {
    setSection(document.documentElement.dataset.section ?? '');
    const onChange = (e: Event) => setSection((e as CustomEvent<string>).detail);
    document.addEventListener('sectionchange', onChange);
    return () => document.removeEventListener('sectionchange', onChange);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={['hr press', s.trigger, className].filter(Boolean).join(' ')}>
          <Menu aria-hidden="true" data-icon="inline-start" />
          {menuLabel}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className={s.sheet}>
        <SheetTitle className={s.title}>{name}</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>

        <nav aria-label="Main">
          <ul className={s.list}>
            {items.map((item) => {
              const current = item.current ? 'page' : item.spy && item.spy === section ? 'location' : undefined;
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <a href={item.href} className={`${s.link} hf`} aria-current={current}>
                      {item.label}
                    </a>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        <ActionButton
          label={cv.label}
          href={cv.href}
          download={cv.download || undefined}
          icon="download"
          size="lg"
          className={s.cv}
        />
      </SheetContent>
    </Sheet>
  );
}

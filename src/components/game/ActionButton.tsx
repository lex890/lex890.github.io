import { ArrowRight, Download, Mail, Printer, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const icons = {
  'arrow-right': ArrowRight,
  download: Download,
  mail: Mail,
  printer: Printer,
} satisfies Record<string, LucideIcon>;

type Tone = 'primary' | 'secondary' | 'ink';

type Props = {
  label: string;
  /** Renders an <a> when set, otherwise a <button>. */
  href?: string;
  tone?: Tone;
  size?: 'default' | 'lg' | 'sm';
  icon?: keyof typeof icons;
  /** Extra attributes for links, e.g. download / target. */
  download?: boolean | string;
  /** Open in a new tab (outbound links such as repos and demos). */
  external?: boolean;
  /** Accessible name when the visible label is ambiguous ("Select" → "Select Project X"). */
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
};

// tone → shadcn variant + hover treatment (_effects.scss)
const tones: Record<Tone, { variant: 'default' | 'outline'; ink?: true; fx: string }> = {
  primary: { variant: 'default', fx: 'hf hf-dark press' },
  secondary: { variant: 'outline', fx: 'hr press' },
  ink: { variant: 'default', ink: true, fx: 'hf hf-dark press' },
};

/**
 * Site button built on shadcn's Button. Safe to render from .astro without a
 * client directive (ships no JS) when it's just a link.
 *   <ActionButton label="View projects" href="#projects" icon="arrow-right" size="lg" />
 */
export default function ActionButton({
  label,
  href,
  tone = 'primary',
  size = 'default',
  icon,
  download,
  external,
  ariaLabel,
  className,
  onClick,
}: Props) {
  const { variant, ink, fx } = tones[tone];
  const Icon = icon ? icons[icon] : null;
  const content = (
    <>
      {label}
      {Icon && <Icon aria-hidden="true" data-icon="inline-end" />}
    </>
  );

  return (
    <Button
      variant={variant}
      size={size}
      data-tone={ink ? 'ink' : undefined}
      className={[fx, className].filter(Boolean).join(' ')}
      asChild={Boolean(href)}
      aria-label={href ? undefined : ariaLabel}
      onClick={onClick}
    >
      {href ? (
        <a
          href={href}
          download={download}
          aria-label={ariaLabel}
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </Button>
  );
}

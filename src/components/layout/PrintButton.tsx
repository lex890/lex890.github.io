import ActionButton from '@/components/game/ActionButton';

/** "Print / Save as PDF" — opens the browser's print dialog. Hydrate with client:idle. */
export default function PrintButton({ label }: { label: string }) {
  return <ActionButton label={label} icon="printer" onClick={() => window.print()} />;
}

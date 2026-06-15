import { HelpMeWriteButton } from '@/features/ai-assist';

interface AiTextareaControlProps {
  id: string;
  fieldId: string;
  label: string;
  value: string;
  enabled: boolean;
  controlClass?: string;
  onChange: (value: string) => void;
}

const defaultAreaClass =
  'block w-full px-3 py-2 pb-12 text-slate-900 shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-slate-50';

/** Textarea control rendered inside a Formwright `ai-textarea` widget. */
export function AiTextareaControl({
  id,
  fieldId,
  label,
  value,
  enabled,
  controlClass,
  onChange,
}: AiTextareaControlProps) {
  return (
    <div className="relative col-span-12">
      <textarea
        id={id}
        name={fieldId}
        rows={5}
        value={value}
        disabled={!enabled}
        onChange={(e) => onChange(e.target.value)}
        className={controlClass ?? defaultAreaClass}
      />
      <div className="absolute bottom-2 end-2">
        <HelpMeWriteButton fieldLabel={label} value={value} onAccept={onChange} />
      </div>
    </div>
  );
}

import { createRoot, type Root } from 'react-dom/client';
import { registerWidget } from '@formwright/dom';
import '@formwright/dom';
import { AiTextareaControl } from '@/features/wizard/components/ai-textarea-control';

let registered = false;

/** Register Formwright DOM renderer customisations once at app startup. */
export function setupFormwright(): void {
  if (registered) return;
  registered = true;

  // Date fields honour `props.max` (e.g. block future dates of birth).
  registerWidget('date', (ctx) => {
    const input = document.createElement('input');
    input.type = 'date';
    input.id = ctx.field.domId;
    input.name = ctx.field.id;
    const controlClass = ctx.field.schema.classes?.control;
    if (controlClass) {
      for (const token of controlClass.split(/\s+/)) {
        if (token) input.classList.add(token);
      }
    }
    const max = ctx.field.schema.props?.max;
    if (typeof max === 'string') input.max = max;

    ctx.scope.bind(() => {
      const v = ctx.field.value.get();
      const str = v == null ? '' : String(v);
      if (input.value !== str) input.value = str;
    });
  input.addEventListener('input', () => {
    ctx.form.setFieldValue(ctx.field, input.value);
  });
  input.addEventListener('change', () => {
    ctx.form.setFieldValue(ctx.field, input.value);
  });
    ctx.scope.bind(() => {
      input.disabled = !ctx.field.enabled.get();
    });
    return input;
  });

  // Textarea with an optional "Help me write" AI assist button (step 3).
  registerWidget('ai-textarea', {
    mount(host, binding) {
      let root: Root | null = null;
      const render = () => {
        if (!root) root = createRoot(host);
        root.render(
          <AiTextareaControl
            id={binding.field.domId}
            fieldId={binding.field.id}
            label={String(binding.field.schema.label ?? binding.field.id)}
            value={String(binding.value() ?? '')}
            enabled={binding.field.enabled.get()}
            controlClass={binding.field.schema.classes?.control}
            onChange={(value) => binding.setValue(value)}
          />,
        );
      };
      binding.onValue(() => render());
      binding.onEnabled(() => render());
      render();
      return () => {
        root?.unmount();
        root = null;
      };
    },
  });
}

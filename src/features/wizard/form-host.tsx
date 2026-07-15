/**
 * Formwright demo host — the README React pattern:
 *   new Form(schema).mount(ref) + form.on('success' | 'error')
 *
 * Draft cache, validation, and wizard nav are handled by @formwright/core +
 * @formwright/dom. Success UI is driven by the form's `success` event (public
 * npm 0.2.x); submit errors use the built-in `.fw-alert`.
 */
import { useEffect, useMemo, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Form, type FormValues } from '@formwright/core';
import { useTranslation } from 'react-i18next';
import { SuccessScreen } from '@/features/wizard/components/success-screen';
import { applicationSchema, PERSIST_KEY } from '@/features/wizard/schema';
import { submitApplication, type SubmitResult } from '@/features/wizard/submit-application';
import type { ApplicationData } from '@/features/wizard/types';

function flatten(values: FormValues): ApplicationData {
  const wizard = values.wizard as Record<string, Record<string, string>> | undefined;
  return {
    name: wizard?.personal?.name ?? '',
    nationalId: wizard?.personal?.nationalId ?? '',
    dateOfBirth: wizard?.personal?.dateOfBirth ?? '',
    gender: (wizard?.personal?.gender ?? '') as ApplicationData['gender'],
    address: wizard?.personal?.address ?? '',
    city: wizard?.personal?.city ?? '',
    state: wizard?.personal?.state ?? '',
    country: wizard?.personal?.country ?? '',
    phone: wizard?.personal?.phone ?? '',
    email: wizard?.personal?.email ?? '',
    maritalStatus: (wizard?.family?.maritalStatus ?? '') as ApplicationData['maritalStatus'],
    dependents: wizard?.family?.dependents ?? '',
    employmentStatus: (wizard?.family?.employmentStatus ?? '') as ApplicationData['employmentStatus'],
    monthlyIncome: wizard?.family?.monthlyIncome ?? '',
    housingStatus: (wizard?.family?.housingStatus ?? '') as ApplicationData['housingStatus'],
    currentFinancialSituation: wizard?.situation?.currentFinancialSituation ?? '',
    employmentCircumstances: wizard?.situation?.employmentCircumstances ?? '',
    reasonForApplying: wizard?.situation?.reasonForApplying ?? '',
  };
}

export function FormHost() {
  const { t, i18n } = useTranslation();
  const hostRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const schema = useMemo(() => applicationSchema(t), [t, i18n.language]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let successRoot: Root | null = null;

    const form = new Form(schema, {}, {
      persistKey: PERSIST_KEY,
      providers: { i18n: { t: (key, args) => String(t(key, args as never)) } },
      send: async (payload) => {
        try {
          return await submitApplication(flatten(payload as FormValues));
        } catch {
          throw new Error(String(t('submit.error')));
        }
      },
    });

    const disposeMount = form.mount(host);

    const showSuccess = (data: SubmitResult) => {
      host.hidden = true;
      const panel = successRef.current;
      if (!panel) return;
      panel.hidden = false;
      successRoot?.unmount();
      successRoot = createRoot(panel);
      successRoot.render(
        <SuccessScreen referenceNumber={data.referenceNumber} />,
      );
    };

    const offSuccess = form.on('success', (data) => {
      showSuccess(data as SubmitResult);
    });

    return () => {
      offSuccess();
      successRoot?.unmount();
      disposeMount();
      form.destroy();
    };
  }, [schema, t]);

  return (
    <div className="formwright-host max-sm:pb-24">
      <div ref={hostRef} />
      <div ref={successRef} hidden />
    </div>
  );
}

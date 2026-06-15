import type { FormSchema } from '@formwright/core';
import type { TFunction } from 'i18next';

/** Formwright `persistKey` — restores values on refresh, cleared on submit. */
export const PERSIST_KEY = 'social-support-wizard:draft';

const today = () => new Date().toISOString().slice(0, 10);

const field = {
  field: 'text-start',
  label: 'mb-1 block text-sm font-medium text-slate-700',
  control:
    'block w-full text-slate-900',
  error: 'mt-1 text-sm text-red-600',
};

/** The whole wizard as Formwright schema data — labels via `$t`, validation via `t()`. */
export function applicationSchema(t: TFunction): FormSchema {
  const req = t('validation.required');

  return {
    id: 'social-support',
    version: '1.0',
    persist: {
      mode: 'auto',
      resumeMessage: { $t: 'resume.body' },
      resumeLabel: { $t: 'resume.resume' },
      discardLabel: { $t: 'resume.discard' },
    },
    success: {
      heading: { $t: 'submit.successTitle' },
      message: `${t('submit.successIntro')} {{referenceNumber}}.`,
    },
    fields: [
      {
        id: 'wizard',
        type: 'steps',
        layout: 'bar',
        showProgress: true,
        nextLabel: { $t: 'nav.next' },
        prevLabel: { $t: 'nav.back' },
        submitLabel: { $t: 'nav.submit' },
        fields: [
          {
            id: 'personal',
            type: 'step',
            label: { $t: 'steps.personal' },
            fields: [
              {
                id: 'name',
                type: 'text',
                label: { $t: 'fields.name' },
                colSpan: 6,
                autocomplete: 'name',
                classes: field,
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'nationalId',
                type: 'text',
                label: { $t: 'fields.nationalId' },
                colSpan: 6,
                classes: field,
                validation: {
                  kind: 'string',
                  required: true,
                  pattern: '^\\d+$',
                  messages: { required: req, pattern: t('validation.nationalId') },
                },
              },
              {
                id: 'dateOfBirth',
                type: 'date',
                label: { $t: 'fields.dateOfBirth' },
                colSpan: 6,
                autocomplete: 'bday',
                props: { max: today() },
                classes: field,
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'gender',
                type: 'select',
                label: { $t: 'fields.gender' },
                colSpan: 6,
                placeholder: { $t: 'placeholders.select' },
                classes: field,
                options: [
                  { label: { $t: 'options.gender.male' }, value: 'male' },
                  { label: { $t: 'options.gender.female' }, value: 'female' },
                  { label: { $t: 'options.gender.other' }, value: 'other' },
                ],
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'address',
                type: 'text',
                label: { $t: 'fields.address' },
                colSpan: 12,
                autocomplete: 'street-address',
                classes: field,
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'city',
                type: 'text',
                label: { $t: 'fields.city' },
                colSpan: 6,
                autocomplete: 'address-level2',
                classes: field,
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'state',
                type: 'text',
                label: { $t: 'fields.state' },
                colSpan: 6,
                autocomplete: 'address-level1',
                classes: field,
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'country',
                type: 'text',
                label: { $t: 'fields.country' },
                colSpan: 6,
                autocomplete: 'country-name',
                classes: field,
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'phone',
                type: 'text',
                label: { $t: 'fields.phone' },
                colSpan: 6,
                autocomplete: 'tel',
                classes: field,
                validation: {
                  kind: 'string',
                  required: true,
                  pattern: '^[+]?[\\d\\s-]{7,15}$',
                  messages: { required: req, pattern: t('validation.phone') },
                },
              },
              {
                id: 'email',
                type: 'email',
                label: { $t: 'fields.email' },
                colSpan: 12,
                autocomplete: 'email',
                classes: field,
                validation: {
                  kind: 'string',
                  format: 'email',
                  required: true,
                  messages: { required: req, format: t('validation.email') },
                },
              },
            ],
          },
          {
            id: 'family',
            type: 'step',
            label: { $t: 'steps.family' },
            fields: [
              {
                id: 'maritalStatus',
                type: 'select',
                label: { $t: 'fields.maritalStatus' },
                colSpan: 6,
                placeholder: { $t: 'placeholders.select' },
                classes: field,
                options: [
                  { label: { $t: 'options.maritalStatus.single' }, value: 'single' },
                  { label: { $t: 'options.maritalStatus.married' }, value: 'married' },
                  { label: { $t: 'options.maritalStatus.divorced' }, value: 'divorced' },
                  { label: { $t: 'options.maritalStatus.widowed' }, value: 'widowed' },
                ],
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'dependents',
                type: 'text',
                label: { $t: 'fields.dependents' },
                colSpan: 6,
                classes: field,
                validation: {
                  kind: 'string',
                  required: true,
                  pattern: '^\\d+$',
                  messages: { required: req, pattern: t('validation.min0') },
                },
              },
              {
                id: 'employmentStatus',
                type: 'select',
                label: { $t: 'fields.employmentStatus' },
                colSpan: 6,
                placeholder: { $t: 'placeholders.select' },
                classes: field,
                options: [
                  { label: { $t: 'options.employmentStatus.employed' }, value: 'employed' },
                  { label: { $t: 'options.employmentStatus.unemployed' }, value: 'unemployed' },
                  { label: { $t: 'options.employmentStatus.selfEmployed' }, value: 'selfEmployed' },
                  { label: { $t: 'options.employmentStatus.student' }, value: 'student' },
                  { label: { $t: 'options.employmentStatus.retired' }, value: 'retired' },
                ],
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
              {
                id: 'monthlyIncome',
                type: 'text',
                label: { $t: 'fields.monthlyIncome' },
                colSpan: 6,
                classes: field,
                validation: {
                  kind: 'string',
                  required: true,
                  pattern: '^\\d+$',
                  messages: { required: req, pattern: t('validation.min0') },
                },
              },
              {
                id: 'housingStatus',
                type: 'select',
                label: { $t: 'fields.housingStatus' },
                colSpan: 12,
                placeholder: { $t: 'placeholders.select' },
                classes: field,
                options: [
                  { label: { $t: 'options.housingStatus.owned' }, value: 'owned' },
                  { label: { $t: 'options.housingStatus.rented' }, value: 'rented' },
                  { label: { $t: 'options.housingStatus.withFamily' }, value: 'withFamily' },
                  { label: { $t: 'options.housingStatus.homeless' }, value: 'homeless' },
                ],
                validation: { kind: 'string', required: true, messages: { required: req } },
              },
            ],
          },
          {
            id: 'situation',
            type: 'step',
            label: { $t: 'steps.situation' },
            fields: [
              {
                id: 'currentFinancialSituation',
                type: 'textarea',
                label: { $t: 'fields.currentFinancialSituation' },
                colSpan: 12,
                widget: 'ai-textarea',
                classes: {
                  ...field,
                  control: `${field.control} pb-12`,
                },
                validation: {
                  kind: 'string',
                  required: true,
                  minLength: 10,
                  messages: { required: req, minLength: t('validation.tooShort') },
                },
              },
              {
                id: 'employmentCircumstances',
                type: 'textarea',
                label: { $t: 'fields.employmentCircumstances' },
                colSpan: 12,
                widget: 'ai-textarea',
                classes: {
                  ...field,
                  control: `${field.control} pb-12`,
                },
                validation: {
                  kind: 'string',
                  required: true,
                  minLength: 10,
                  messages: { required: req, minLength: t('validation.tooShort') },
                },
              },
              {
                id: 'reasonForApplying',
                type: 'textarea',
                label: { $t: 'fields.reasonForApplying' },
                colSpan: 12,
                widget: 'ai-textarea',
                classes: {
                  ...field,
                  control: `${field.control} pb-12`,
                },
                validation: {
                  kind: 'string',
                  required: true,
                  minLength: 10,
                  messages: { required: req, minLength: t('validation.tooShort') },
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

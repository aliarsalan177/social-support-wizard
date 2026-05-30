/**
 * Builds the user prompt sent to OpenAI for a given Step 3 field.
 * Includes whatever the applicant has already typed so the model can
 * refine rather than ignore their input, and asks for the response in
 * the active UI language.
 */
export function buildPrompt(
  fieldLabel: string,
  existingText: string,
  language: string,
): string {
  const langName = language.startsWith('ar') ? 'Arabic' : 'English';
  const base = `Help me write the "${fieldLabel}" section of my social-support application. Respond in ${langName}.`;
  const draft = existingText.trim();
  return draft
    ? `${base}\n\nHere is what I have so far, please improve and expand it:\n"${draft}"`
    : `${base}\n\nI have not written anything yet. Please draft a clear first version.`;
}

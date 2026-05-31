/**
 * Mock "submit application" endpoint for the deployed demo.
 *
 * Vercel serves files under /api as serverless functions, so this stands in for
 * a real backend in production (in dev the same route is mocked by MSW). It just
 * acknowledges the POST and returns a reference number.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const referenceNumber = `SSW-${Date.now().toString().slice(-6)}`;
  res.status(201).json({ referenceNumber });
}

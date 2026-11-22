/**
 * Generates an incrementing unique application ID in format AA-YYYY-XXXX (e.g. AA-2026-0001)
 */
export function generateApplicationId(existingApps: { id: string }[]): string {
  const currentYear = new Date().getFullYear();
  let maxSequence = 0;

  for (const app of existingApps) {
    if (!app.id) continue;
    const match = app.id.match(/^AA-(\d{4})-(\d+)$/);
    if (match) {
      const seq = parseInt(match[2], 10);
      if (!isNaN(seq) && seq > maxSequence) {
        maxSequence = seq;
      }
    }
  }

  const nextSequence = String(maxSequence + 1).padStart(4, '0');
  return `AA-${currentYear}-${nextSequence}`;
}

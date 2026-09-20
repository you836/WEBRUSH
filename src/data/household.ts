import type { LifeActivity } from '@/types';

export interface HouseholdRecord {
  Date: string;
  Mode: string;
  Category: string;
  Subcategory: string;
  Note: string;
  Amount: string;
  'Income/Expense': string;
  Currency: string;
}

function normalizeDate(raw: string): string {
  if (!raw) return '2024-01-01T00:00:00Z';
  // Handle "20/09/2018 12:04:08" or "20/09/2018" format (DD/MM/YYYY)
  const parts = raw.split(' ');
  const dateParts = parts[0].split('/');
  if (dateParts.length === 3) {
    const [day, month, year] = dateParts;
    const time = parts[1] || '00:00:00';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}Z`;
  }
  if (raw.includes('T')) return raw;
  return `${raw}T00:00:00Z`;
}

export function normalizeHouseholdData(records: HouseholdRecord[]): LifeActivity[] {
  return records
    .filter(r => r.Amount && parseFloat(r.Amount) > 0)
    .map((r) => {
      const amount = parseFloat(r.Amount) || 0;
      const isIncome = r['Income/Expense'] === 'Income';
      const category = r.Category || 'Other';
      const subcategory = r.Subcategory || '';
      const note = r.Note || '';

      const title = note || (subcategory ? `${category} — ${subcategory}` : category);

      return {
        id: crypto.randomUUID(),
        source: 'household' as const,
        timestamp: normalizeDate(r.Date),
        title,
        description: subcategory ? `${category}: ${subcategory}` : category,
        category,
        amount,
        currency: r.Currency || 'INR',
        tags: [
          category,
          ...(subcategory ? [subcategory] : []),
          r.Mode || 'Cash',
          isIncome ? 'Income' : 'Expense',
        ].filter(Boolean),
        metadata: {
          subcategory: subcategory || undefined,
          mode: r.Mode || 'Cash',
          incomeExpense: r['Income/Expense'] || 'Expense',
        },
      };
    });
}

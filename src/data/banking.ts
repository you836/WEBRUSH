import type { LifeActivity } from '@/types';

export interface BankingRecord {
  trans_id: string;
  trans_date_trans_time: string;
  cc_num: string;
  merchant: string;
  category: string;
  amt: string;
  first: string;
  last: string;
  gender: string;
  street: string;
  city: string;
  state: string;
  lat: string;
  long: string;
  city_pop: string;
  job: string;
  dob: string;
  merch_lat: string;
  merch_long: string;
  is_fraud: string;
  customer_id: string;
}

function cleanMerchant(raw: string): string {
  if (!raw) return 'Unknown Merchant';
  // Remove "fraud_" prefix and replace underscores with spaces
  return raw.replace(/^fraud_/i, '').replace(/_/g, ' ').trim() || 'Unknown Merchant';
}

function cleanCategory(raw: string): string {
  if (!raw) return 'Other';
  // Clean up category names: "online_shopping" -> "Online Shopping"
  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function maskCard(ccNum: string): string {
  if (!ccNum) return '';
  const cleaned = ccNum.replace(/[^0-9]/g, '');
  if (cleaned.length < 4) return '';
  return `•••• ${cleaned.slice(-4)}`;
}

function normalizeDateTime(raw: string): string {
  if (!raw) return '2024-01-01T00:00:00Z';
  // Handle "12/26/2023 0:55" format
  const parts = raw.split(' ');
  if (parts.length >= 1) {
    const dateParts = parts[0].split('/');
    if (dateParts.length === 3) {
      const [month, day, year] = dateParts;
      const time = parts[1] || '00:00';
      const timeParts = time.split(':');
      const hour = (timeParts[0] || '0').padStart(2, '0');
      const minute = (timeParts[1] || '0').padStart(2, '0');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour}:${minute}:00Z`;
    }
  }
  // Try ISO format
  if (raw.includes('T')) return raw;
  return `${raw}T00:00:00Z`;
}

export function normalizeBankingData(records: BankingRecord[]): LifeActivity[] {
  return records
    .filter(r => r.amt && parseFloat(r.amt) > 0)
    .map((r) => {
      const amount = parseFloat(r.amt) || 0;
      const merchant = cleanMerchant(r.merchant);
      const category = cleanCategory(r.category);
      const city = r.city || undefined;
      const state = r.state || undefined;
      const location = [city, state].filter(Boolean).join(', ') || undefined;

      return {
        id: crypto.randomUUID(),
        source: 'banking' as const,
        timestamp: normalizeDateTime(r.trans_date_trans_time),
        title: merchant,
        description: category !== 'Other' ? `${category} transaction` : undefined,
        category,
        amount,
        currency: 'INR',
        location,
        tags: [category, ...(city ? [city] : []), ...(state ? [state] : [])],
        metadata: {
          transId: r.trans_id,
          cardMasked: maskCard(r.cc_num),
          // PRIVACY: Never expose full names, DOB, street, or customer IDs
          creditDebit: amount > 0 ? 'debit' : 'credit',
          ...(city ? { city } : {}),
          ...(state ? { state } : {}),
        },
      };
    });
}

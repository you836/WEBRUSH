import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function formatCurrency(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string): string {
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return 'Invalid date';
    return format(parsed, 'MMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

export function formatDateTime(date: string): string {
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return 'Invalid date';
    return format(parsed, 'MMM d, yyyy h:mm a');
  } catch {
    return 'Invalid date';
  }
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export function formatRelativeTime(date: string): string {
  try {
    const parsed = parseISO(date);
    if (!isValid(parsed)) return '';
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return '';
  }
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len - 1) + '…';
}

export function maskCardNumber(last4: string): string {
  return `•••• ${last4}`;
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatMonth(monthKey: string): string {
  try {
    const parsed = parseISO(monthKey + '-01');
    if (!isValid(parsed)) return monthKey;
    return format(parsed, 'MMM yyyy');
  } catch {
    return monthKey;
  }
}

export function formatShortMonth(monthKey: string): string {
  try {
    const parsed = parseISO(monthKey + '-01');
    if (!isValid(parsed)) return monthKey;
    return format(parsed, 'MMM');
  } catch {
    return monthKey;
  }
}

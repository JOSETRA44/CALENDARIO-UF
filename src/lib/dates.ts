const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
];

const MONTHS_SHORT = [
  'Ene','Feb','Mar','Abr','May','Jun',
  'Jul','Ago','Sep','Oct','Nov','Dic',
];

/**
 * Given a YYYY-MM-DD string, returns the next Date occurrence using only
 * month + day (annual recurrence). If today IS the date, returns today.
 */
export function nextOccurrence(dateStr: string): Date {
  const [, m, d] = dateStr.split('-').map(Number);
  const now  = new Date();
  const year = now.getFullYear();

  // Normalize to midnight for comparison
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(year, m - 1, d);

  if (target < todayMidnight) {
    target = new Date(year + 1, m - 1, d);
  }

  return target;
}

/** True if month+day of dateStr matches today's month+day */
export function isToday(dateStr: string): boolean {
  const now = new Date();
  const [, m, d] = dateStr.split('-').map(Number);
  return now.getMonth() + 1 === m && now.getDate() === d;
}

/** Remaining ms until targetDate; 0 if in the past */
export function msUntil(date: Date): number {
  return Math.max(0, date.getTime() - Date.now());
}

/** Decompose milliseconds into days/hours/minutes/seconds */
export function decompose(ms: number) {
  return {
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor(ms % 86_400_000 / 3_600_000),
    minutes: Math.floor(ms % 3_600_000  /    60_000),
    seconds: Math.floor(ms %    60_000  /     1_000),
  };
}

/** "15 de Marzo" */
export function formatDateLong(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} de ${MONTHS_ES[m - 1]}`;
}

/** "15 Mar" */
export function formatDateShort(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS_SHORT[m - 1]}`;
}

/** Human-readable time remaining */
export function labelCountdown(
  cd: { days: number; hours: number; minutes: number },
  today: boolean
): string {
  if (today)             return '¡Hoy!';
  if (cd.days === 0 && cd.hours === 0)  return `En ${cd.minutes}m`;
  if (cd.days === 0)                    return `En ${cd.hours}h ${cd.minutes}m`;
  if (cd.days === 1)                    return 'Mañana';
  if (cd.days <  7)                     return `En ${cd.days} días`;
  if (cd.days < 30)                     return `En ${Math.floor(cd.days / 7)} semanas`;
  return `En ${cd.days} días`;
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

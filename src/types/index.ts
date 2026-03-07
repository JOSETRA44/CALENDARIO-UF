export interface Birthday {
  id: string;
  nombre: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  descripcion?: string;
  avatar_url?: string;
  departamento?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  nombre: string;
  fecha: string; // YYYY-MM-DD
  descripcion?: string;
  tipo: 'nacional' | 'empresa' | 'regional';
  es_recurrente: boolean;
  icono?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  type: 'birthday' | 'holiday';
  nombre: string;
  dateStr: string;   // YYYY-MM-DD — month+day used for recurring calculation
  nextDate: Date;    // next occurrence
  isToday: boolean;
  descripcion?: string;
  departamento?: string;
  subtype?: string;  // holiday tipo: 'nacional' | 'empresa' | 'regional'
}

export type TabFilter = 'todos' | 'cumpleanos' | 'festivos';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

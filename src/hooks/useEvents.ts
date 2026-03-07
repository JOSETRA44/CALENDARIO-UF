'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { nextOccurrence, isToday } from '@/lib/dates';
import type { Birthday, CalendarEvent, Holiday } from '@/types';

interface UseEventsReturn {
  events:  CalendarEvent[];
  loading: boolean;
  error:   string | null;
  refetch: () => Promise<void>;
}

export function useEvents(): UseEventsReturn {
  const [events,  setEvents]  = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [{ data: births, error: e1 }, { data: holidays, error: e2 }] = await Promise.all([
        supabase.from('cumpleanios').select('*').eq('activo', true),
        supabase.from('dias_festivos').select('*').eq('activo', true),
      ]);

      if (e1) throw new Error(e1.message);
      if (e2) throw new Error(e2.message);

      const birthdayEvents: CalendarEvent[] = ((births ?? []) as Birthday[]).map(b => ({
        id:          b.id,
        type:        'birthday',
        nombre:      b.nombre,
        dateStr:     b.fecha_nacimiento,
        nextDate:    nextOccurrence(b.fecha_nacimiento),
        isToday:     isToday(b.fecha_nacimiento),
        emoji:       '🎂',
        descripcion: b.descripcion,
        departamento: b.departamento,
      }));

      const now = new Date();
      const holidayEvents: CalendarEvent[] = ((holidays ?? []) as Holiday[])
        .map(h => {
          const next = h.es_recurrente
            ? nextOccurrence(h.fecha)
            : new Date(h.fecha + 'T00:00:00');
          return {
            id:          h.id,
            type:        'holiday' as const,
            nombre:      h.nombre,
            dateStr:     h.fecha,
            nextDate:    next,
            isToday:     isToday(h.fecha),
            emoji:       h.icono ?? '🎉',
            descripcion: h.descripcion,
            subtype:     h.tipo,
          };
        })
        .filter(h => h.nextDate >= now || h.isToday);

      const sorted = [...birthdayEvents, ...holidayEvents]
        .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

      setEvents(sorted);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al cargar eventos: ${msg}`);
      console.error('[useEvents]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    // Re-fetch every 5 minutes
    const id = setInterval(fetchEvents, 300_000);
    return () => clearInterval(id);
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

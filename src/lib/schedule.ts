import { DaySchedule, StoreScheduleConfig } from '../types';

export const DEFAULT_SCHEDULE_DAYS: DaySchedule[] = [
  { day: 1, name: 'Lunes', enabled: true, openTime: '10:00', closeTime: '19:00' },
  { day: 2, name: 'Martes', enabled: true, openTime: '10:00', closeTime: '19:00' },
  { day: 3, name: 'Miércoles', enabled: true, openTime: '10:00', closeTime: '19:00' },
  { day: 4, name: 'Jueves', enabled: true, openTime: '10:00', closeTime: '19:00' },
  { day: 5, name: 'Viernes', enabled: true, openTime: '10:00', closeTime: '19:00' },
  { day: 6, name: 'Sábado', enabled: true, openTime: '10:00', closeTime: '19:00' },
  { day: 0, name: 'Domingo', enabled: true, openTime: '11:00', closeTime: '17:00' },
];

export const DEFAULT_STORE_SCHEDULE: StoreScheduleConfig = {
  enabled: true,
  blockOrdersWhenClosed: true,
  closedNotice:
    'Nuestro atelier se encuentra cerrado en este momento. Los pedidos en línea están pausados temporalmente hasta nuestro próximo horario de atención.',
  days: DEFAULT_SCHEDULE_DAYS,
};

/** Convierte "14:30" a "2:30 pm" */
export function formatTime12h(time24: string): string {
  if (!time24 || !time24.includes(':')) return time24;
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h) || isNaN(m)) return time24;

  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const mFormatted = m === 0 ? '' : `:${String(m).padStart(2, '0')}`;
  return `${h12}${mFormatted} ${period}`;
}

/** Genera un texto resumen amigable a partir de la configuración */
export function formatScheduleSummary(schedule?: StoreScheduleConfig): string {
  if (!schedule || !schedule.enabled || !Array.isArray(schedule.days) || schedule.days.length === 0) {
    return 'Lunes a Sábado: 10:00 am – 7:00 pm | Domingos y feriados: 11:00 am – 5:00 pm';
  }

  const enabledDays = schedule.days.filter((d) => d.enabled);
  if (enabledDays.length === 0) {
    return 'Temporalmente cerrado';
  }

  // Agrupar días con mismos horarios
  const groups: { names: string[]; timeRange: string }[] = [];
  for (const d of schedule.days) {
    if (!d.enabled) continue;
    const range = `${formatTime12h(d.openTime)} – ${formatTime12h(d.closeTime)}`;
    const last = groups[groups.length - 1];
    if (last && last.timeRange === range) {
      last.names.push(d.name);
    } else {
      groups.push({ names: [d.name], timeRange: range });
    }
  }

  return groups
    .map((g) => {
      const daysText =
        g.names.length > 2
          ? `${g.names[0]} a ${g.names[g.names.length - 1]}`
          : g.names.join(' y ');
      return `${daysText}: ${g.timeRange}`;
    })
    .join(' | ');
}

export interface PeruDateTime {
  dayOfWeek: number; // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  hours: number;
  minutes: number;
  timeString: string; // "14:30"
  dateString: string; // "2026-10-26"
}

/** Obtiene la fecha y hora actual en la zona horaria de Perú (America/Lima) */
export function getPeruDateTime(): PeruDateTime {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Lima',
      hour12: false,
      weekday: 'short',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const parts = formatter.formatToParts(now);
    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;

    const weekdayMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };
    const dayOfWeek = weekdayMap[map.weekday] ?? now.getDay();
    const hours = parseInt(map.hour, 10);
    const minutes = parseInt(map.minute, 10);
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    const dateString = `${map.year}-${map.month}-${map.day}`;

    return { dayOfWeek, hours, minutes, timeString, dateString };
  } catch {
    // Fallback si no soporta timeZone
    const dayOfWeek = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { dayOfWeek, hours, minutes, timeString, dateString: now.toISOString().slice(0, 10) };
  }
}

export interface ScheduleStatus {
  isOpen: boolean;
  canOrder: boolean;
  currentDayName: string;
  currentTimeString: string;
  todaySchedule?: DaySchedule;
  message: string;
  badgeText: string;
}

/** Evalúa si el Atelier está abierto y si se permiten pedidos en este momento */
export function evaluateStoreSchedule(schedule?: StoreScheduleConfig): ScheduleStatus {
  const fallback = DEFAULT_STORE_SCHEDULE;
  const cfg = schedule?.days?.length ? schedule : fallback;

  const { dayOfWeek, timeString } = getPeruDateTime();
  const dayOrder = [1, 2, 3, 4, 5, 6, 0]; // Lunes a Domingo
  const todaySchedule = cfg.days.find((d) => d.day === dayOfWeek);
  const currentDayName = todaySchedule?.name || 'Hoy';

  // Si el control de horario está desactivado, siempre abierto
  if (!cfg.enabled) {
    return {
      isOpen: true,
      canOrder: true,
      currentDayName,
      currentTimeString: timeString,
      todaySchedule,
      message: 'Atendiendo normalmente.',
      badgeText: 'Abierto',
    };
  }

  // Si hoy no atiende
  if (!todaySchedule || !todaySchedule.enabled) {
    const isBlocking = cfg.blockOrdersWhenClosed;
    return {
      isOpen: false,
      canOrder: !isBlocking,
      currentDayName,
      currentTimeString: timeString,
      todaySchedule,
      message:
        cfg.closedNotice ||
        `El atelier se encuentra cerrado los días ${currentDayName}. Puedes escribirnos por WhatsApp para coordinar tu pedido.`,
      badgeText: 'Cerrado hoy',
    };
  }

  const { openTime, closeTime } = todaySchedule;
  const isTimeInRange = timeString >= openTime && timeString < closeTime;

  if (isTimeInRange) {
    return {
      isOpen: true,
      canOrder: true,
      currentDayName,
      currentTimeString: timeString,
      todaySchedule,
      message: `Abierto hoy hasta las ${formatTime12h(closeTime)}.`,
      badgeText: `Abierto · hasta ${formatTime12h(closeTime)}`,
    };
  }

  const isBeforeOpen = timeString < openTime;
  const nextText = isBeforeOpen
    ? `Hoy abrimos a las ${formatTime12h(openTime)}.`
    : `Hoy cerramos a las ${formatTime12h(closeTime)}.`;

  const isBlocking = cfg.blockOrdersWhenClosed;
  return {
    isOpen: false,
    canOrder: !isBlocking,
    currentDayName,
    currentTimeString: timeString,
    todaySchedule,
    message:
      cfg.closedNotice ||
      `El atelier está cerrado en este momento. ${nextText} Horario de atención: de ${formatTime12h(openTime)} a ${formatTime12h(closeTime)}.`,
    badgeText: isBeforeOpen ? `Cerrado · Abre ${formatTime12h(openTime)}` : 'Cerrado ahora',
  };
}

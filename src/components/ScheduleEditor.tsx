import React, { useState, useEffect } from 'react';
import { DaySchedule, StoreScheduleConfig } from '../types';
import {
  evaluateStoreSchedule,
  formatScheduleSummary,
  formatTime12h,
  getPeruDateTime,
} from '../lib/schedule';

interface ScheduleEditorProps {
  schedule?: StoreScheduleConfig;
  noticeText?: string;
  scheduleTitle?: string;
  onChange: (schedule: StoreScheduleConfig) => void;
  onNoticeChange?: (notice: string) => void;
  onTitleChange?: (title: string) => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  schedule,
  noticeText = '',
  scheduleTitle = '',
  onChange,
  onNoticeChange,
  onTitleChange,
}) => {
  // Current time state to re-evaluate badge every 10 seconds
  const [currentPeruTime, setCurrentPeruTime] = useState(getPeruDateTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPeruTime(getPeruDateTime());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const safeSchedule: StoreScheduleConfig = schedule?.days?.length
    ? schedule
    : {
        enabled: true,
        blockOrdersWhenClosed: true,
        closedNotice:
          'Nuestro atelier se encuentra cerrado en este momento. Los pedidos en línea están pausados temporalmente hasta nuestro próximo horario de atención.',
        days: [
          { day: 1, name: 'Lunes', enabled: true, openTime: '10:00', closeTime: '19:00' },
          { day: 2, name: 'Martes', enabled: true, openTime: '10:00', closeTime: '19:00' },
          { day: 3, name: 'Miércoles', enabled: true, openTime: '10:00', closeTime: '19:00' },
          { day: 4, name: 'Jueves', enabled: true, openTime: '10:00', closeTime: '19:00' },
          { day: 5, name: 'Viernes', enabled: true, openTime: '10:00', closeTime: '19:00' },
          { day: 6, name: 'Sábado', enabled: true, openTime: '10:00', closeTime: '19:00' },
          { day: 0, name: 'Domingo', enabled: true, openTime: '11:00', closeTime: '17:00' },
        ],
      };

  const status = evaluateStoreSchedule(safeSchedule);

  const handleUpdateDay = (dayIndex: number, updates: Partial<DaySchedule>) => {
    const newDays = safeSchedule.days.map((d) => (d.day === dayIndex ? { ...d, ...updates } : d));
    onChange({
      ...safeSchedule,
      days: newDays,
    });
  };

  const handleApplyToAllWeekdays = (sourceDayIndex: number) => {
    const sourceDay = safeSchedule.days.find((d) => d.day === sourceDayIndex);
    if (!sourceDay) return;
    const weekdays = [1, 2, 3, 4, 5, 6]; // Lun - Sab
    const newDays = safeSchedule.days.map((d) => {
      if (weekdays.includes(d.day)) {
        return {
          ...d,
          enabled: sourceDay.enabled,
          openTime: sourceDay.openTime,
          closeTime: sourceDay.closeTime,
        };
      }
      return d;
    });
    onChange({
      ...safeSchedule,
      days: newDays,
    });
  };

  return (
    <div className="space-y-6 bg-[#1f1410] p-5 sm:p-6 rounded-xl border border-[#3e2821] text-surface">
      {/* Header with live status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a251e] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">schedule</span>
            <h3 className="font-headline-sm text-base text-secondary-fixed">
              Configuración de Horario & Bloqueo de Pedidos
            </h3>
          </div>
          <p className="text-xs text-primary-fixed-dim mt-1">
            Define con exactitud los días y horas de apertura. Hora actual en Lima: {currentPeruTime.timeString}
          </p>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#140b08] border border-[#3e2821]">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          ></span>
          <span className="text-xs font-semibold tracking-wider uppercase">
            {status.isOpen ? 'Atelier Abierto ahora' : 'Atelier Cerrado ahora'}
          </span>
        </div>
      </div>

      {/* Master Switches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#180e0b] p-4 rounded-lg border border-[#38221b]">
        {/* Switch 1: Horario Activo */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={safeSchedule.enabled}
            onChange={(e) => onChange({ ...safeSchedule, enabled: e.target.checked })}
            className="mt-1 w-4 h-4 rounded text-secondary bg-[#120a07] border-[#3e2821] focus:ring-secondary cursor-pointer"
          />
          <div>
            <span className="text-sm font-semibold text-surface-bright block">
              Control de Horario Activo
            </span>
            <span className="text-xs text-primary-fixed-dim leading-relaxed block">
              Si se desactiva, la tienda aparecerá siempre abierta sin restricciones.
            </span>
          </div>
        </label>

        {/* Switch 2: Bloquear compras cuando cerrado */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={safeSchedule.blockOrdersWhenClosed}
            onChange={(e) => onChange({ ...safeSchedule, blockOrdersWhenClosed: e.target.checked })}
            className="mt-1 w-4 h-4 rounded text-secondary bg-[#120a07] border-[#3e2821] focus:ring-secondary cursor-pointer"
          />
          <div>
            <span className="text-sm font-semibold text-rose-300 block flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              Bloquear compras/pedidos en horario cerrado
            </span>
            <span className="text-xs text-primary-fixed-dim leading-relaxed block">
              Impide que los clientes pasen a pagar por Culqi fuera de las horas configuradas.
            </span>
          </div>
        </label>
      </div>

      {/* Days Table / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-label-md uppercase tracking-wider text-secondary-fixed">
            Días y Selectores de Horas
          </h4>
          <span className="text-[11px] text-primary-fixed-dim">Formato 24h (hh:mm)</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {safeSchedule.days.map((day) => (
            <div
              key={day.day}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
                day.enabled
                  ? 'bg-[#180e0b] border-[#3e2821]'
                  : 'bg-[#120a07]/60 border-[#281814] opacity-60'
              }`}
            >
              {/* Day Toggle & Name */}
              <div className="flex items-center gap-3 min-w-[130px]">
                <input
                  type="checkbox"
                  id={`day-enabled-${day.day}`}
                  checked={day.enabled}
                  onChange={(e) => handleUpdateDay(day.day, { enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-secondary bg-[#120a07] border-[#3e2821] focus:ring-secondary cursor-pointer"
                />
                <label
                  htmlFor={`day-enabled-${day.day}`}
                  className="text-sm font-medium text-surface-bright cursor-pointer select-none"
                >
                  {day.name}
                </label>
              </div>

              {/* Time Inputs */}
              {day.enabled ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-[#120a07] px-2.5 py-1.5 rounded border border-[#38221b]">
                    <span className="text-xs text-primary-fixed-dim">Apertura:</span>
                    <input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => handleUpdateDay(day.day, { openTime: e.target.value })}
                      className="bg-transparent text-sm text-surface font-mono focus:outline-none cursor-pointer"
                    />
                  </div>

                  <span className="text-primary-fixed-dim text-xs">hasta</span>

                  <div className="flex items-center gap-1.5 bg-[#120a07] px-2.5 py-1.5 rounded border border-[#38221b]">
                    <span className="text-xs text-primary-fixed-dim">Cierre:</span>
                    <input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => handleUpdateDay(day.day, { closeTime: e.target.value })}
                      className="bg-transparent text-sm text-surface font-mono focus:outline-none cursor-pointer"
                    />
                  </div>

                  <span className="text-xs text-secondary-fixed ml-1 hidden lg:inline">
                    ({formatTime12h(day.openTime)} – {formatTime12h(day.closeTime)})
                  </span>

                  {day.day === 1 && (
                    <button
                      type="button"
                      onClick={() => handleApplyToAllWeekdays(1)}
                      className="text-[11px] px-2 py-1 rounded bg-[#2c1a14] hover:bg-secondary hover:text-on-secondary text-primary-fixed-dim transition-colors ml-auto sm:ml-2 cursor-pointer whitespace-nowrap"
                      title="Copiar horario de Lunes a Martes, Miércoles, Jueves, Viernes y Sábado"
                    >
                      Copiar a Lun-Sáb
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-xs text-rose-400 font-medium italic">
                  Cerrado todo el día
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Title, Notice & Closed Notice */}
      <div className="space-y-4 pt-2 border-t border-[#3a251e]">
        {onTitleChange && (
          <div>
            <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
              Título de la sección de Horario en la web
            </label>
            <input
              type="text"
              value={scheduleTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full p-2.5 rounded bg-[#180e0b] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none text-sm"
              placeholder="Horario de atención"
            />
          </div>
        )}

        {onNoticeChange && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs uppercase text-primary-fixed-dim font-label-sm">
                Texto / Nota debajo del horario en la web
              </label>
              {noticeText && (
                <button
                  type="button"
                  onClick={() => onNoticeChange('')}
                  className="text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                >
                  Eliminar este texto
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={noticeText}
              onChange={(e) => onNoticeChange(e.target.value)}
              className="w-full p-2.5 rounded bg-[#180e0b] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none text-sm"
              placeholder="Escribe una nota adicional o déjalo completamente vacío para que no aparezca nada debajo del horario..."
            />
            <p className="text-[11px] text-primary-fixed-dim mt-0.5">
              Si dejas este campo vacío, no aparecerá ningún texto debajo de la tabla de horarios en la web.
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs uppercase text-primary-fixed-dim mb-1 font-label-sm">
            Mensaje de aviso en carrito/checkout cuando esté cerrado
          </label>
          <textarea
            rows={2}
            value={safeSchedule.closedNotice}
            onChange={(e) => onChange({ ...safeSchedule, closedNotice: e.target.value })}
            className="w-full p-2.5 rounded bg-[#180e0b] border border-[#3e2821] text-surface focus:border-secondary focus:outline-none text-sm"
            placeholder="Mensaje que aparecerá en el carrito y checkout si intentan comprar fuera de hora..."
          />
        </div>

        <div className="p-3 rounded-lg bg-[#180e0b] border border-[#38221b] text-xs flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
            info
          </span>
          <div>
            <span className="font-semibold text-secondary-fixed block">
              Resumen que se mostrará en la web:
            </span>
            <span className="text-primary-fixed-dim">
              {formatScheduleSummary(safeSchedule)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

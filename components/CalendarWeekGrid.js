// components/CalendarWeek.js
import { useState, useEffect } from 'react';
import AppointmentModal from './AppointmentModal';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function CalendarWeek({ appointments }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [visibleWeekStart, setVisibleWeekStart] = useState(() => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // start of week (Sunday)
        return start;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(visibleWeekStart);
        d.setDate(d.getDate() + i);
        return d;
    });


    const currentHour = currentTime.getHours();
    const startHour = Math.max(0, currentHour - 3);
    const endHour = Math.min(23, currentHour + 3);

    const hourSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        hourSlots.push(hour);
    }

    const weekStart = new Date(startOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(startOfWeek);
    weekEnd.setDate(weekStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    const weekAppointments = appointments.filter((appt) => {
        const date = new Date(appt.start);
        return date >= visibleWeekStart && date < new Date(visibleWeekStart.getTime() + 7 * 86400000);
    });

    const appointmentsByDayHour = {};
    weekAppointments.forEach((appt) => {
        const apptDate = new Date(appt.start);
        const dayKey = apptDate.toDateString();
        const hour = apptDate.getHours();

        if (!appointmentsByDayHour[dayKey]) {
            appointmentsByDayHour[dayKey] = {};
        }
        if (!appointmentsByDayHour[dayKey][hour]) {
            appointmentsByDayHour[dayKey][hour] = [];
        }
        appointmentsByDayHour[dayKey][hour].push(appt);
    });

    const currentMinutes = currentTime.getMinutes();
    const currentTimePosition = ((currentTime.getHours() - startHour) * 60 + currentMinutes) / ((endHour - startHour + 1) * 60) * 100;

    const formatTime = (hour) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: true
        }).format(new Date().setHours(hour, 0, 0, 0));
    };

    const formatCurrentTime = () => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }).format(currentTime);
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
                <div className="grid grid-cols-8 border-b border-slate-200 text-center">
                    <div className="p-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-600">

                    </div>
                    {weekDays.map((day, dayIndex) => {
                        const isToday = day.toDateString() === today.toDateString();

                        return (
                            <div
                                key={dayIndex}
                                className={`p-1 border-r border-slate-200 relative
                                ${isToday ? 'bg-green-100' : 'bg-purple-50'}`}
                            >

                                <div
                                    className="text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                                >
                                    {day.toLocaleDateString('de-DE', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                    })}
                                </div>

                            </div>
                        );
                    })}
                </div>
                <div className="relative overflow-hidden" style={{ maxHeight: '1920px' }}>
                    <div className="relative">


                        {hourSlots.map((hour, hourIndex) => (
                            <div key={hour} className="grid grid-cols-8 border-b border-slate-100 min-h-[80px]">
                                <div className="p-2 bg-slate-50 border-r border-slate-200 flex items-start justify-center relative min-h-[60px]">
                                    <span className="text-xs font-medium text-slate-600">
                                        {formatTime(hour)}
                                    </span>
                                </div>

                                {weekDays.map((day, dayIndex) => {
                                    const dayKey = day.toDateString();
                                    const dayAppointments = appointmentsByDayHour[dayKey]?.[hour] || [];
                                    const isToday = day.toDateString() === today.toDateString();
                                    const isCurrentHour = isToday && hour === currentTime.getHours();

                                    return (
                                        <div key={dayIndex} className={`p-1 border-r border-slate-200 relative ${isToday ? 'bg-blue-25' : ''} ${isCurrentHour ? 'bg-yellow-50' : ''}`}>
                                            {dayAppointments.map((appt, i) => {
                                                const start = new Date(appt.start);
                                                const end = new Date(appt.end);
                                                const durationMinutes = (end - start) / 60000;

                                                const startMinutes = start.getMinutes();
                                                const top = (startMinutes / 60) * 100;
                                                const height = (durationMinutes / 60) * 100;

                                                const widthPercent = 100 / dayAppointments.length;
                                                const leftPercent = i * widthPercent;

                                                const isSameDay = start.toDateString() === today.toDateString();
                                                const bgColor = isSameDay
                                                    ? 'bg-green-200 hover:bg-green-300 border-l-4 border-green-500'
                                                    : 'bg-purple-200 hover:bg-purple-300 border-l-4 border-purple-500';

                                                return (
                                                    <HoverCard key={appt.id}>
                                                        <HoverCardTrigger asChild>
                                                            <div
                                                                onClick={() => setSelectedAppointment(appt)}
                                                                className={`absolute left-1 right-1 text-black bold text-xs rounded shadow-sm cursor-pointer z-10 ${bgColor}`}
                                                                style={{
                                                                    top: `${top}%`,
                                                                    height: `${height}%`,
                                                                    left: `${leftPercent}%`,
                                                                    width: `${widthPercent}%`,
                                                                }}
                                                                title={`${appt.title} - ${start.toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}`}
                                                            >
                                                                <p className="font-medium truncate">{appt.title}</p>
                                                            </div>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-64 text-sm space-y-1">
                                                            <p className="font-semibold truncate" style={{ fontSize: 'clamp(9px, 2.2vw, 14px)' }}>{appt.title}</p>
                                                            <p className="text-black/80">
                                                                🕘 {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} bis {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                            <p className="text-black/80 truncate">👤 {appt.patients?.firstname} {appt.patients?.lastname}</p>
                                                            <p className="text-black/80 truncate">📍 {appt.location}</p>
                                                            <p className="text-black/80 truncate">🗒️ {appt.notes}</p>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                );
                                            })}

                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {selectedAppointment && (
                            <AppointmentModal
                                appointment={selectedAppointment}
                                onClose={() => setSelectedAppointment(null)}
                            />
                        )}

                        {currentTime.getHours() >= startHour && currentTime.getHours() <= endHour && (
                            <div
                                className="absolute left-0 right-0 z-20 pointer-events-none"
                                style={{ top: `${currentTimePosition}%` }}
                            >
                                <div className="relative">
                                    <div className="h-0.5 bg-red-500 shadow-sm"></div>
                                    <div className="absolute left-2 -top-3 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-md font-medium">
                                        {formatCurrentTime()}
                                    </div>
                                    <div className="absolute left-0 -top-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setVisibleWeekStart(new Date())}
                        className="ml-2 bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        Diese Woche
                    </button>

                    <button
                        onClick={() =>
                            setVisibleWeekStart((prev) => {
                                const next = new Date(prev);
                                next.setDate(prev.getDate() + 7);
                                return next;
                            })
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Nächste Woche laden
                    </button>
                </div>


            </div>

            {/* Legend */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                        <span>Today</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                        <span>Current Hour</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-red-500 rounded"></div>
                        <span>Current Time</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
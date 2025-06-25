// components/CalendarWeek.js
import { useState, useEffect } from 'react';
import AppointmentModal from './AppointmentModal';

export default function CalendarWeek({ appointments }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    // Get current week dates
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay(); // 0 = Sunday
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    // Generate 7 days of the week
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDays.push(day);
    }

    // Generate hour slots (3 hours before to 4 hours after current time)
    const currentHour = currentTime.getHours();
    const startHour = Math.max(0, currentHour - 3);
    const endHour = Math.min(23, currentHour + 4);

    const hourSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        hourSlots.push(hour);
    }

    // Filter appointments for this week
    const weekStart = new Date(startOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(startOfWeek);
    weekEnd.setDate(weekStart.getDate() + 7);
    weekEnd.setHours(23, 59, 59, 999);

    const weekAppointments = appointments.filter((appt) => {
        const apptDate = new Date(appt.start);
        return apptDate >= weekStart && apptDate < weekEnd;
    });

    // Group appointments by day and hour
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

    // Calculate current time position for the red line
    const currentMinutes = currentTime.getMinutes();
    const currentTimePosition = ((currentTime.getHours() - startHour) * 60 + currentMinutes) / ((endHour - startHour + 1) * 60) * 100;

    // Format time for display
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
                {/* Time scale header */}
                <div className="grid grid-cols-8 border-b border-slate-200">
                    <div className="p-2 bg-slate-50 border-r border-slate-200 text-xs font-medium text-slate-600">

                    </div>
                    {weekDays.map((day, index) => {
                        const isToday = day.toDateString() === today.toDateString();
                        return (
                            <div key={index} className={`p-2 text-center border-r border-slate-200 ${isToday ? 'bg-blue-50 text-blue-600 font-semibold' : 'bg-slate-50 text-slate-700'}`}>
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

                {/* Calendar grid with hourly slots */}
                <div className="relative">
                    {hourSlots.map((hour, hourIndex) => (
                        <div key={hour} className="grid grid-cols-8 border-b border-slate-100 min-h-[80px]">
                            {/* Hour label */}
                            <div className="p-2 bg-slate-50 border-r border-slate-200 flex items-start justify-center">
                                <span className="text-xs font-medium text-slate-600">
                                    {formatTime(hour)}
                                </span>
                            </div>

                            {/* Day columns */}
                            {weekDays.map((day, dayIndex) => {
                                const dayKey = day.toDateString();
                                const dayAppointments = appointmentsByDayHour[dayKey]?.[hour] || [];
                                const isToday = day.toDateString() === today.toDateString();
                                const isCurrentHour = isToday && hour === currentTime.getHours();

                                return (
                                    <div key={dayIndex} className={`p-1 border-r border-slate-200 relative ${isToday ? 'bg-blue-25' : ''} ${isCurrentHour ? 'bg-yellow-50' : ''}`}>
                                        {/* Appointments for this hour */}
                                        {dayAppointments.map((appt, apptIndex) => {
                                            const startTime = new Date(appt.start);
                                            const minutes = startTime.getMinutes();
                                            const topPosition = (minutes / 60) * 100;

                                            return (
                                                <div
                                                    key={appt.id}
                                                    onClick={() => setSelectedAppointment(appt)}
                                                    className="p-4 border rounded bg-gray-50 hover:bg-blue-50 cursor-pointer"
                                                >
                                                    <p className="text-lg font-semibold">
                                                        {appt.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600">🕘 {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} bis {new Date(appt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} </p>
                                                    <p className="text-xs text-gray-600">👤 {appt.patients?.firstname} {appt.patients?.lastname}</p>
                                                    <p className="text-xs text-gray-600">📍 {appt.location}</p>

                                                </div>

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

                    {/* Current time red line */}
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
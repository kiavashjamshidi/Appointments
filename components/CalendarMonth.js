// components/CalendarMonth.js

export default function CalendarMonth({ appointments }) {
    // Get current month/year
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = Jan
    const currentYear = today.getFullYear();

    // Get first day of the month and how many days in the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    // Month names for display
    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    // Filter appointments for this month and group by date
    const monthAppointments = appointments.filter((appt) => {
        const date = new Date(appt.start);
        return (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        );
    });

    // Group appointments by day
    const appointmentsByDay = {};
    monthAppointments.forEach((appt) => {
        const day = new Date(appt.start).getDate();
        if (!appointmentsByDay[day]) {
            appointmentsByDay[day] = [];
        }
        appointmentsByDay[day].push(appt);
    });

    // Create calendar grid
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    // Split into weeks (arrays of 7 days each)
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    // Get today's date for highlighting
    const todayDate = today.getDate();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    return (
        <div className="w-full">
            {/* Calendar Header */}
            <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold text-slate-800">
                    {monthNames[currentMonth]} {currentYear}
                </h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Days of week header */}
                <div className="grid grid-cols-7 bg-slate-800 text-white">
                    {['Son', 'Mon', 'Di', 'Mi', 'Do', 'Fri', 'Sa'].map((day) => (
                        <div key={day} className="p-3 text-center font-semibold text-sm">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7">
                    {weeks.map((week, weekIndex) => (
                        week.map((day, dayIndex) => {
                            const isToday = isCurrentMonth && day === todayDate;
                            const dayAppointments = day ? appointmentsByDay[day] || [] : [];

                            return (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={`
                                        min-h-[120px] p-2 border-r border-b border-slate-200
                                        ${day ? 'bg-white hover:bg-slate-50' : 'bg-slate-100'}
                                        ${isToday ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset' : ''}
                                    `}
                                >
                                    {day && (
                                        <>
                                            {/* Day number */}
                                            <div className={`
                                                text-sm font-semibold mb-1
                                                ${isToday ? 'text-blue-600' : 'text-slate-700'}
                                            `}>
                                                {day}
                                            </div>

                                            {/* Appointments for this day */}
                                            <div className="space-y-1">
                                                {dayAppointments.slice(0, 3).map((appt, index) => (
                                                    <div
                                                        key={appt.id}
                                                        className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 truncate cursor-pointer hover:bg-blue-200"
                                                        title={`${appt.title} - ${new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                                    >
                                                        <div className="font-medium truncate">
                                                            {appt.title}
                                                        </div>
                                                        <div className="text-blue-600">
                                                            {new Date(appt.start).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Show "+" indicator if more than 3 appointments */}
                                                {dayAppointments.length > 3 && (
                                                    <div className="text-xs text-slate-500 font-medium">
                                                        +{dayAppointments.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
                    <span>Today</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 rounded"></div>
                    <span>Has Appointments</span>
                </div>
            </div>
        </div>
    );
}
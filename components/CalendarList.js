// components/CalendarList.js
import React from 'react';

export default function CalendarList({ appointments }) {
    if (!appointments || appointments.length === 0) {
        return <p className="text-center text-gray-500">No appointments found.</p>;
    }

    // Group appointments by day (YYYY-MM-DD)
    const grouped = appointments.reduce((acc, appt) => {
        const dateObj = new Date(appt.start);
        const key = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"
        acc[key] = acc[key] || [];
        acc[key].push(appt);
        return acc;
    }, {});

    // Sort dates
    const sortedDays = Object.keys(grouped).sort();

    return (
        <div className="space-y-8">
            {sortedDays.map((day) => {
                const date = new Date(day);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const dayLabel = date.toLocaleDateString(undefined, options);

                return (
                    <div key={day}>
                        <h2 className="text-xl font-bold border-b pb-1 mb-2">{dayLabel}</h2>
                        <ul className="space-y-4">
                            {grouped[day].map((appt) => (
                                <li key={appt.id} className="p-4 border rounded bg-gray-50 hover:bg-blue-50">
                                    <p className="text-lg font-semibold">
                                        🕘 {new Date(appt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                                        - {new Date(appt.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                                    </p>
                                    {appt.patient && (
                                        <p className="text-sm text-gray-700">
                                            👤 {appt.patients?.firstname} {appt.patients?.lastname}
                                        </p>

                                    )}
                                    {appt.notes && (
                                        <p className="text-sm text-gray-600">
                                            📝 {appt.notes}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

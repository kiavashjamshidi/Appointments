'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import CalendarMonth from '../../components/CalendarMonth';
import CalendarList from '../../components/CalendarList';
import CalendarWeekGrid from '../../components/CalendarWeekGrid';
import FilterBar from '../../components/FilterBar';

export default function CalendarPage() {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [view, setView] = useState('month'); // 'month', 'list', 'week'

    useEffect(() => {
        fetchAppointments();
    }, []);
    async function fetchAppointments() {
        try {
            // First, get all appointments
            const { data: appointments, error: appointmentsError } = await supabase
                .from('appointments')
                .select('*')
                .order('start', { ascending: true });

            if (appointmentsError) {
                console.error('Error fetching appointments:', appointmentsError.message);
                return;
            }

            const patientIds = [...new Set(appointments.map(apt => apt.patient).filter(Boolean))];
            const categoryIds = [...new Set(appointments.map(apt => apt.category).filter(Boolean))];

            if (patientIds.length === 0) {
                setAppointments(appointments);
                setFilteredAppointments(appointments);
                return;
            }

            // Fetch patient data for those IDs
            const { data: patients, error: patientsError } = await supabase
                .from('patients')
                .select('id, firstname, lastname')
                .in('id', patientIds);

            if (patientsError) {
                console.error('Error fetching patients:', patientsError.message);
                setAppointments(appointments);
                setFilteredAppointments(appointments);
                return;
            }

            const { data: categories, error: categoriesError } = await supabase
                .from('categories')
                .select('id, label') 
                .in('id', categoryIds);

            // Create a lookup map for patients
            const patientMap = {};
            patients.forEach(patient => {
                patientMap[patient.id] = patient;
            });

            // Combine the data
            const appointmentsWithPatients = appointments.map(appointment => ({
                ...appointment,
                patients: appointment.patient ? patientMap[appointment.patient] : null,
                category: appointment.category ? categories.find(cat => cat.id === appointment.category) : null
            }));

            setAppointments(appointmentsWithPatients);
            setFilteredAppointments(appointmentsWithPatients);

        } catch (error) {
            console.error('Error in fetchAppointments:', error);
        }
    }


    return (
        <div className="p-8 space-y-6 max-w-screen-lg mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    {['list', 'week', 'month'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-1 rounded border text-sm ${view === v ? 'bg-blue-600 text-white' : 'bg-gray-100'
                                }`}
                        >
                            {v === 'month' ? 'Monat' : v === 'list' ? 'List' : 'Woche'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 mb-4">
                <FilterBar
                    appointments={appointments}
                    onFilter={setFilteredAppointments}
                />
                <a
                    href="/new"
                    className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
                >
                    <span className="text-white text-xl">+  </span>
                    Neuer Termin
                </a>
            </div>


            <div className="overflow-auto">
                {view === 'list' ? (
                    <CalendarList appointments={filteredAppointments} />
                ) : view === 'week' ? (
                    <CalendarWeekGrid appointments={filteredAppointments} />
                ) : (
                    <CalendarMonth appointments={filteredAppointments} />
                )}
            </div>
        </div>
    );
}
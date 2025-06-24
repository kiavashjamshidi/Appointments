'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewAppointmentPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);

    const [patientForm, setPatientForm] = useState({
        firstname: '',
        lastname: '',
        birth_date: '',
        care_level: '',
        pronoun: '',
        email: '',
        active: true,
        active_since: '',
    });

    const [appointmentForm, setAppointmentForm] = useState({
        title: '',
        start: '',
        end: '',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState(null);

    function handlePatientChange(e) {
        const { name, value, type, checked } = e.target;
        setPatientForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function handleAppointmentChange(e) {
        const { name, value } = e.target;
        setAppointmentForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handlePatientSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const { firstname, lastname, birth_date } = patientForm;

        // Check if patient already exists
        const { data: existing, error } = await supabase
            .from('patients')
            .select('*')
            .eq('firstname', firstname)
            .eq('lastname', lastname)
            .eq('birth_date', birth_date)
            .single();

        if (error && error.code !== 'PGRST116') {
            alert('Error checking patient');
            console.error(error);
            setLoading(false);
            return;
        }

        if (existing) {
            setPatientId(existing.id);
            setStep(2);
            setLoading(false);
        } else {
            // Create new patient
            const { data, error: insertError } = await supabase
                .from('patients')
                .insert([patientForm])
                .select()
                .single();

            if (insertError) {
                alert('Error creating patient');
                console.error(insertError);
                setLoading(false);
                return;
            }

            setPatientId(data.id);
            setStep(2);
            setLoading(false);
        }
    }

    async function handleAppointmentSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('appointments').insert([
            {
                ...appointmentForm,
                start: new Date(appointmentForm.start),
                end: new Date(appointmentForm.end),
                patient: patientId,
            },
        ]);

        setLoading(false);
        if (error) {
            alert('Error creating appointment');
            console.error(error);
        } else {
            router.push('/calendar');
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-8 p-8">
            <div className="relative flex flex-col rounded-xl bg-transparent">
                <h4 className="block text-xl font-medium text-slate-800">
                    {step === 1 ? 'Patient Information' : 'Appointment Details'}
                </h4>
                <p className="text-slate-500 font-light">
                    {step === 1
                        ? 'Enter patient details to create or find existing patient.'
                        : 'Schedule your appointment with the selected patient.'}
                </p>

                {step === 1 ? (
                    <form onSubmit={handlePatientSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={patientForm.firstname}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="First Name"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={patientForm.lastname}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Birth Date
                                </label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={patientForm.birth_date}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Care Level
                                </label>
                                <input
                                    type="number"
                                    name="care_level"
                                    value={patientForm.care_level}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Care Level"
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Pronoun
                                </label>
                                <select
                                    name="pronoun"
                                    value={patientForm.pronoun}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                >
                                    <option value="">Select pronoun</option>
                                    <option value="he/him">He/Him</option>
                                    <option value="she/her">She/Her</option>
                                    <option value="they/them">They/Them</option>
                                    <option value="ze/zir">Ze/Zir</option>
                                    <option value="xe/xem">Xe/Xem</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={patientForm.email}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Email Address"
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Active Since
                                </label>
                                <input
                                    type="date"
                                    name="active_since"
                                    value={patientForm.active_since}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                            </div>
                        </div>

                        <div className="inline-flex items-center mt-2">
                            <label className="flex items-center cursor-pointer relative" htmlFor="active-check">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={patientForm.active}
                                    onChange={handlePatientChange}
                                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                                    id="active-check"
                                />

                            </label>
                            <label className="cursor-pointer ml-2 text-slate-600 text-sm" htmlFor="active-check">
                                Patient is Active
                            </label>
                        </div>

                        <button
                            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Checking Patient...' : 'Next: Appointment Details'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAppointmentSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Appointment Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={appointmentForm.title}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Appointment Title"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Start Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="start"
                                    value={appointmentForm.start}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    End Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="end"
                                    value={appointmentForm.end}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={appointmentForm.notes}
                                    onChange={handleAppointmentChange}
                                    rows={3}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </div>

                        <button
                            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Creating Appointment...' : 'Create Appointment'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="mt-2 w-full rounded-md bg-transparent py-2 px-4 border border-slate-300 text-center text-sm text-slate-700 transition-all shadow-sm hover:shadow-md focus:bg-slate-50 focus:shadow-none active:bg-slate-50 hover:bg-slate-50 active:shadow-none"
                        >
                            Back to Patient Info
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NewAppointmentPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (step === 2) {
            fetchCategories();
        }
    }, [step]);

    async function fetchCategories() {
        const { data, error } = await supabase.from('categories').select('*');
        if (!error) setCategories(data);
    }

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
        category: '',
        location: '',
        attachements: '',
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

        const { email } = patientForm;

        const { data: existing, error } = await supabase
            .from('patients')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            alert('Fehler bei der Patientenüberprüfung');
            console.error(error);
            setLoading(false);
            return;
        }

        if (existing) {
            setPatientId(existing.id);
            setStep(2);
            setLoading(false);
        } else {
            const { data, error: insertError } = await supabase
                .from('patients')
                .insert([patientForm])
                .select()
                .single();

            if (insertError) {
                alert('Fehler beim Erstellen des Patienten');
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

        const { error: insertError } = await supabase.from('appointments').insert([
            {
                ...appointmentForm,
                start: new Date(appointmentForm.start),
                end: new Date(appointmentForm.end),
                patient: patientId,
                category: appointmentForm.category,
                attachements: appointmentForm.attachements
                    ? appointmentForm.attachements.split(',').map((a) => a.trim())
                    : [],
            },
        ]);

        setLoading(false);
        console.log(insertError);

        if (insertError) {
            alert('Fehler beim Erstellen des Termins');
            console.error(insertError);
        } else {
            router.push('/calendar');
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-8 p-8">
            <div className="relative flex flex-col rounded-xl bg-transparent">
                <h4 className="block text-xl font-medium text-slate-800">
                    {step === 1 ? 'Patienteninformationen' : 'Termindetails'}
                </h4>
                <p className="text-slate-500 font-light">
                    {step === 1
                        ? 'Geben Sie die Patientendaten ein, um einen bestehenden Patienten zu finden oder einen neuen zu erstellen.'
                        : 'Planen Sie Ihren Termin mit dem ausgewählten Patienten.'}
                </p>

                {step === 1 ? (
                    <form onSubmit={handlePatientSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Vorname</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={patientForm.firstname}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Vorname"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Nachname</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={patientForm.lastname}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Nachname"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Geburtsdatum</label>
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
                                <label className="block mb-2 text-sm text-slate-600">Pflegegrad</label>
                                <input
                                    type="number"
                                    name="care_level"
                                    value={patientForm.care_level}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Pflegegrad"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Anrede</label>
                                <select
                                    name="pronoun"
                                    value={patientForm.pronoun}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                >
                                    <option value="">Anrede auswählen</option>
                                    <option value="he/him">Er/Ihn</option>
                                    <option value="she/her">Sie/Ihr</option>
                                    <option value="they/them">Sie (plural)</option>
                                    <option value="ze/zir">Ze/Zir</option>
                                    <option value="xe/xem">Xe/Xem</option>
                                    <option value="other">Andere</option>
                                    <option value="prefer-not-to-say">Möchte ich nicht sagen</option>
                                </select>
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">E-Mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={patientForm.email}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="E-Mail Adresse"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Aktiv Seit</label>
                                <input
                                    type="date"
                                    name="active_since"
                                    value={patientForm.active_since}
                                    onChange={handlePatientChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    name="active"
                                    checked={patientForm.active}
                                    onChange={handlePatientChange}
                                    className="w-5 h-5 accent-slate-800 rounded border border-slate-300"
                                />
                                <label htmlFor="active" className="text-sm text-slate-600">
                                    Aktiv
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? 'Wird geprüft...' : 'Weiter'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAppointmentSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                        <div className="mb-1 flex flex-col gap-6">
                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Titel</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={appointmentForm.title}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Termin Titel"
                                    required
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Startzeit</label>
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
                                <label className="block mb-2 text-sm text-slate-600">Endzeit</label>
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
                                <label className="block mb-2 text-sm text-slate-600">Kategorie</label>
                                <select
                                    name="category"
                                    value={appointmentForm.category}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    required
                                >
                                    <option value="">Kategorie auswählen</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.label} — {cat.description}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Ort</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={appointmentForm.location}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Ort des Termins"
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">Notizen</label>
                                <textarea
                                    name="notes"
                                    value={appointmentForm.notes}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Notizen"
                                    rows={3}
                                />
                            </div>

                            <div className="w-full max-w-sm min-w-[200px]">
                                <label className="block mb-2 text-sm text-slate-600">
                                    Anhänge (durch Komma trennen)
                                </label>
                                <input
                                    type="text"
                                    name="attachements"
                                    value={appointmentForm.attachements}
                                    onChange={handleAppointmentChange}
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder="Dateipfade oder URLs"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        >
                            {loading ? 'Termin wird erstellt...' : 'Termin erstellen'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

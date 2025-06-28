'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AppointmentModal({ appointment, onClose }) {
    if (!appointment) return null;

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        title: appointment.title,
        start: toDateTimeLocalString(appointment.start),
        end: toDateTimeLocalString(appointment.end),
        location: appointment.location || '',
        notes: appointment.notes || '',
        attachements: appointment.attachements?.join(', ') || '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    function toUTCISOString(datetimeLocal) {
        const localDate = new Date(datetimeLocal);
        return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    }

    const handleDelete = async () => {
        const confirmed = confirm('Möchtest du diesen Termin wirklich löschen?');
        if (!confirmed) return;

        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', appointment.id);

        if (error) {
            alert('Fehler beim Löschen.');
            console.error(error);
        } else {
            alert('Termin gelöscht.');
            onClose();
        }
    };


    const handleSave = async () => {
        const { error } = await supabase
            .from('appointments')
            .update({
                title: form.title,
                start: toUTCISOString(form.start),
                end: toUTCISOString(form.end),
                location: form.location,
                notes: form.notes,
                attachements: form.attachements.split(',').map((a) => a.trim()),
            })
            .eq('id', appointment.id);

        if (error) {
            alert('Fehler beim Speichern.');
            console.error(error);
        } else {
            alert('Termin aktualisiert.');
            setEditMode(false);
            onClose();
        }
    };

    function formatDisplayDateTime(dateInput) {
        const date = new Date(dateInput);
        return date.toLocaleString([], {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    }

    function toDateTimeLocalString(isoString) {
        const date = new Date(isoString);
        const tzOffset = date.getTimezoneOffset() * 60000; // in ms
        const localISO = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
        return localISO;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
                >
                    ✕
                </button>

                <div className="mb-4 flex justify-between items-start">
                    <h2 className="text-xl font-bold">
                        {editMode ? 'Termin bearbeiten' : appointment.title}
                    </h2>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {editMode ? 'Abbrechen' : 'Bearbeiten'}
                    </button>
                </div>

                <div className="space-y-3 text-sm">
                    {editMode ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Titel</label>

                                <input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Titel"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Startzeit</label>

                                <input
                                    type="datetime-local"
                                    name="start"
                                    value={form.start}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Endzeit</label>

                                <input
                                    type="datetime-local"
                                    name="end"
                                    value={form.end}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Ort</label>

                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Ort"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Notizen</label>

                                <textarea
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    rows={3}
                                    placeholder="Notizen"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1">Anhänge (mit Kommas trennen)</label>

                                <input
                                    name="attachments"
                                    value={form.attachements}
                                    onChange={handleChange}
                                    className="w-full border p-2 rounded"
                                    placeholder="Anhänge (mit Kommas trennen)"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <div className="text-right">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Speichern
                                    </button>
                                </div>
                                <div className="text-right">
                                    <button
                                        onClick={handleDelete}
                                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Löschen
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p><strong>🕒 Start:</strong> {formatDisplayDateTime(appointment.start)}</p>
                            <p><strong>🕓 Ende:</strong> {formatDisplayDateTime(appointment.end)}</p>
                            <p><strong>📍 Ort:</strong> {appointment.location}</p>
                            <p><strong>👤 Patient:</strong> {appointment.patients?.firstname} {appointment.patients?.lastname}</p>
                            <p><strong>🏷️ Kategorie:</strong> {appointment.category?.label}</p>
                            <p><strong>📝 Notizen:</strong> {appointment.notes}</p>
                            <div>
                                <strong>📎 Anhänge:</strong>
                                <ul className="list-disc list-inside text-gray-700 text-sm">
                                    {appointment.attachements?.map((file, idx) => (
                                        <li key={idx}>{file}</li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

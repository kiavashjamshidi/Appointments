'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';

export default function AppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, []);

  async function fetchAppointment() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment:', error.message);
    } else {
      setAppointment(data);
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setAppointment((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setUpdating(true);

    const { error } = await supabase
      .from('appointments')
      .update({
        title: appointment.title,
        start: new Date(appointment.start),
        end: new Date(appointment.end),
        notes: appointment.notes,
      })
      .eq('id', id);

    setUpdating(false);
    if (error) {
      alert('Update failed');
      console.error(error.message);
    } else {
      alert('Updated!');
      router.push('/calendar');
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!appointment) return <p className="p-6">Appointment not found</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Appointment</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          type="text"
          name="title"
          value={appointment.title || ''}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          type="datetime-local"
          name="start"
          value={appointment.start?.slice(0, 16)}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          type="datetime-local"
          name="end"
          value={appointment.end?.slice(0, 16)}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          name="notes"
          value={appointment.notes || ''}
          onChange={handleChange}
          placeholder="Notes"
          rows={4}
        />
        <button
          type="submit"
          disabled={updating}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

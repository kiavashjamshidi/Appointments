// components/FilterBar.js
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import NewAppointmentPage from '@/app/new/page';

export default function FilterBar({ appointments, onFilter }) {
  const [categories, setCategories] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    patient: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  async function fetchFilters() {
    const [catRes, patRes] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('patients').select('*'),
    ]);

    if (!catRes.error) setCategories(catRes.data);
    if (!patRes.error) setPatients(patRes.data);
  }

  function applyFilters() {
    let filtered = [...appointments];

    if (filters.category) {
      filtered = filtered.filter(
        (a) => a.category === filters.category
      );
    }

    if (filters.patient) {
      filtered = filtered.filter(
        (a) => a.patient === filters.patient
      );
    }

    if (filters.from) {
      const fromDate = new Date(filters.from);
      filtered = filtered.filter(
        (a) => new Date(a.start) >= fromDate
      );
    }

    if (filters.to) {
      const toDate = new Date(filters.to);
      filtered = filtered.filter(
        (a) => new Date(a.start) <= toDate
      );
    }

    onFilter(filtered);
  }

  function resetFilters() {
    setFilters({
      category: '',
      patient: '',
      from: '',
      to: '',
    });
    onFilter(appointments); // Reset to all
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="mb-4 flex flex-wrap gap-4 items-end border p-4 rounded">
      {/* Category */}
      <div>
        <label className="block text-sm font-semibold">Category</label>
        <select
          name="category"
          onChange={handleChange}
          value={filters.category}
          className="border p-1 rounded"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Patient */}
      <div>
        <label className="block text-sm font-semibold">Patient</label>
        <select
          name="patient"
          onChange={handleChange}
          value={filters.patient}
          className="border p-1 rounded"
        >
          <option value="">All</option>
          {patients.map((pat) => (
            <option key={pat.id} value={pat.id}>
              {pat.firstname} {pat.lastname}
            </option>
          ))}
        </select>
      </div>

      {/* Date From */}
      <div>
        <label className="block text-sm font-semibold">From</label>
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
          className="border p-1 rounded"
        />
      </div>

      {/* Date To */}
      <div>
        <label className="block text-sm font-semibold">To</label>
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
          className="border p-1 rounded"
        />
      </div>

      {/* Buttons */}
      <div className="space-x-2">
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Apply
        </button>
        <button
          onClick={resetFilters}
          className="bg-gray-300 px-3 py-1 rounded"
        >
          Reset
        </button>

        <a href="./new">

          <button
            onClick={NewAppointmentPage}
            className="bg-black text-white px-3 py-1 rounded"
          >
            New Appointment
          </button>
        </a>

      </div>
    </div>
  );
}

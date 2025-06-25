'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FilterBar({ appointments, onFilter }) {
  const [categories, setCategories] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function applyFilters() {
    let filtered = [...appointments];

    if (filters.category)
      filtered = filtered.filter((a) => a.category === filters.category);

    if (filters.patient)
      filtered = filtered.filter((a) => a.patient === filters.patient);

    if (filters.from)
      filtered = filtered.filter(
        (a) => new Date(a.start) >= new Date(filters.from)
      );

    if (filters.to)
      filtered = filtered.filter(
        (a) => new Date(a.start) <= new Date(filters.to)
      );

    onFilter(filtered);
    setIsOpen(false);
  }

  function resetFilters() {
    setFilters({ category: '', patient: '', from: '', to: '' });
    onFilter(appointments);
    setIsOpen(false);
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded shadow"
      >
        🔍 Termine filtern
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end">
          <div className="w-80 bg-white p-6 h-full shadow-lg overflow-auto">
            <h2 className="text-xl font-bold mb-4">Filter Appointments</h2>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select
                name="category"
                onChange={handleChange}
                value={filters.category}
                className="w-full border p-2 rounded"
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
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Patient</label>
              <select
                name="patient"
                onChange={handleChange}
                value={filters.patient}
                className="w-full border p-2 rounded"
              >
                <option value="">All</option>
                {patients.map((pat) => (
                  <option key={pat.id} value={pat.id}>
                    {pat.firstname} {pat.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* From */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">From Date</label>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* To */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1">To Date</label>
              <input
                type="date"
                name="to"
                value={filters.to}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={resetFilters}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

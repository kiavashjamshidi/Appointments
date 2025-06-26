// components/AppointmentModal.js
export default function AppointmentModal({ appointment, onClose }) {
    if (!appointment) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 text-lg"
                >
                    ✕
                </button>
                <h2 className="text-xl font-bold mb-3">{appointment.title}</h2>
                <p><strong>Start:</strong> {new Date(appointment.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(appointment.end).toLocaleString()}</p>
                <p><strong>Location:</strong> {appointment.location}</p>
                <p><strong>Patient:</strong> {appointment.patients?.firstname} {appointment.patients?.lastname}</p>
                <p><strong>Category:</strong> {appointment.category?.label}</p>
                <p><strong>Notes:</strong> {appointment.notes}</p>

                <div className="mt-3">
                    <strong>Attachments:</strong>
                    <ul className="list-disc list-inside">
                        {appointment.attachments?.map((file, idx) => (
                            <li key={idx}>{file}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

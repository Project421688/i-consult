import React from 'react';

const EFormViewer = ({ appointment, onBack }) => {
  const eForm = appointment.eForm;

  if (!eForm) {
    return (
      <div className="w-full max-w-4xl m-5">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition-all"
          >
            ← Back
          </button>
          <h2 className="text-xl font-medium">eForm View</h2>
        </div>
        <div className="bg-white border rounded p-8 text-center text-gray-500">
          No eForm data available for this appointment.
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl m-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition-all"
          >
            ← Back
          </button>
          <h2 className="text-xl font-medium">eForm - {appointment.userData.name}</h2>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-all"
        >
          Print
        </button>
      </div>

      <div className="bg-white border rounded p-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-primary">
              Dr. {appointment.docData.name} - {appointment.docData.speciality}
            </h1>
            <p className="text-sm text-gray-600">
              {appointment.docData.address.line1}, {appointment.docData.address.line2}
            </p>
            <p className="text-sm text-gray-600">Email: {appointment.docData.email}</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Prescription ID:</strong> PR-{appointment._id.slice(0, 6)}</p>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-semibold mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Name:</strong> {eForm.patientName || appointment.userData.name}</p>
            <p><strong>Age:</strong> {eForm.patientAge || 'N/A'}</p>
            <p><strong>Gender:</strong> {eForm.patientGender || appointment.userData.gender}</p>
            <p><strong>Contact:</strong> {eForm.patientContact || appointment.userData.phone}</p>
            <p className="col-span-2"><strong>Address:</strong> {eForm.patientAddress || ''}</p>
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Chief Complaint</h3>
          <p className="text-sm text-gray-700">{eForm.chiefComplaint || 'N/A'}</p>
        </div>

        {/* Clinical Notes */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Clinical Notes</h3>
          <p className="text-sm text-gray-700">{eForm.clinicalNotes || 'N/A'}</p>
        </div>

        {/* Vital Signs */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Vital Signs</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Blood Pressure:</strong>
              <p>{eForm.bloodPressure || 'N/A'}</p>
            </div>
            <div>
              <strong>Pulse:</strong>
              <p>{eForm.pulse || 'N/A'}</p>
            </div>
            <div>
              <strong>Temperature:</strong>
              <p>{eForm.temperature || 'N/A'}</p>
            </div>
            <div>
              <strong>Weight:</strong>
              <p>{eForm.weight || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Prescription */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Prescription</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Form/Strength</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {eForm.prescriptions && eForm.prescriptions.length > 0 ? (
                eForm.prescriptions.map((prescription, index) => (
                  <tr key={index}>
                    <td>{prescription.medicine || ''}</td>
                    <td>{prescription.form || ''}</td>
                    <td>{prescription.dosage || ''}</td>
                    <td>{prescription.frequency || ''}</td>
                    <td>{prescription.duration || ''}</td>
                    <td>{prescription.notes || ''}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500">No prescriptions</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Tests */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Tests Ordered</h3>
          <p className="text-sm text-gray-700">{eForm.tests || 'N/A'}</p>
        </div>

        {/* Diagnosis */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Diagnosis</h3>
          <p className="text-sm text-gray-700">{eForm.diagnosis || 'N/A'}</p>
        </div>

        {/* Advice */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Advice</h3>
          <p className="text-sm text-gray-700">{eForm.advice || 'N/A'}</p>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 mt-6 text-sm text-gray-600">
          <p>Generated by i-Consult on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default EFormViewer;
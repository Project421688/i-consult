import React, { useState, useContext, useEffect } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const EFormHistory = ({ patientId, onBack, onSelectForm }) => {
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dToken } = useContext(DoctorContext);
  const { backendUrl, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    fetchPatientHistory();
  }, [patientId]);

  const fetchPatientHistory = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/patient-history/${patientId}`,
        { headers: { dToken } }
      );
      if (data.success) {
        setPatientHistory(data.appointments);
      }
    } catch (error) {
      console.error('Error fetching patient history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl m-5">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition-all"
        >
          ← Back
        </button>
        <h2 className="text-xl font-medium">Patient History</h2>
      </div>

      <div className="bg-white border rounded">
        {patientHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No previous appointments found for this patient.
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {patientHistory.map((appointment, index) => (
              <div
                key={appointment._id}
                onClick={() => onSelectForm(appointment)}
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Appointment #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Date: {slotDateFormat(appointment.slotDate)} at {appointment.slotTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {appointment.isCompleted ? 'Completed' : appointment.cancelled ? 'Cancelled' : 'Pending'}
                    </p>
                    {appointment.eForm?.diagnosis && (
                      <p className="text-sm text-gray-600 mt-1">
                        Diagnosis: {appointment.eForm.diagnosis}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.isCompleted 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.cancelled 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.isCompleted ? 'Completed' : appointment.cancelled ? 'Cancelled' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EFormHistory;
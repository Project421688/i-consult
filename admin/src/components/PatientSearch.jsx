import React, { useState, useContext, useEffect } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const PatientSearch = ({ onSelectPatient, onBack }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { dToken } = useContext(DoctorContext);
  const { backendUrl, calculateAge } = useContext(AppContext);

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const fetchAllPatients = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/all-patients`,
        { headers: { dToken } }
      );
      if (data.success) {
        setPatients(data.patients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

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
        <h2 className="text-xl font-medium">Select Patient</h2>
      </div>

      <div className="bg-white border rounded p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                onClick={() => onSelectPatient(patient._id, patient.name)}
                className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
              >
                <img
                  src={patient.image}
                  alt={patient.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                  <p className="text-sm text-gray-600">
                    {patient.phone} • {patient.gender} • 
                    {patient.dob !== 'Not Selected' ? ` Age: ${calculateAge(patient.dob)}` : ' Age: N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-primary">View History →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSearch;
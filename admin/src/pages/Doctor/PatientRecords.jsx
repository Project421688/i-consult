import React, { useState } from 'react';
import PatientSearch from '../../components/PatientSearch';
import EFormHistory from '../../components/EFormHistory';
import EFormViewer from '../../components/EFormViewer';

const PatientRecords = () => {
  const [currentView, setCurrentView] = useState('search'); // 'search', 'history', 'viewer'
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [viewingHistoryForm, setViewingHistoryForm] = useState(null);

  const handleSelectPatient = (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setCurrentView('history');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedPatientId(null);
    setSelectedPatientName('');
    setViewingHistoryForm(null);
  };

  const handleSelectForm = (appointment) => {
    setViewingHistoryForm(appointment);
    setCurrentView('viewer');
  };

  const handleBackFromViewer = () => {
    setCurrentView('history');
    setViewingHistoryForm(null);
  };

  return (
    <div className="w-full max-w-6xl m-5">
      {currentView === 'search' && (
        <div>
          <h1 className="text-lg font-medium mb-4">Patient Medical Records</h1>
          <PatientSearch 
            onSelectPatient={handleSelectPatient} 
            onBack={() => {}} // No back needed from main view
          />
        </div>
      )}
      
      {currentView === 'history' && (
        <EFormHistory 
          patientId={selectedPatientId}
          patientName={selectedPatientName}
          onBack={handleBackToSearch}
          onSelectForm={handleSelectForm}
        />
      )}
      
      {currentView === 'viewer' && (
        <EFormViewer 
          appointment={viewingHistoryForm} 
          onBack={handleBackFromViewer} 
        />
      )}
    </div>
  );
};

export default PatientRecords;
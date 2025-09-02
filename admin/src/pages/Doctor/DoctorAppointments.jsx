import React, { useState, useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import EFormHistory from '../../components/EFormHistory';
import EFormViewer from '../../components/EFormViewer';
import PatientSearch from '../../components/PatientSearch';

// CSS for the MedicalForm component
const medicalFormStyles = `
  .container {
    max-width: 980px;
    margin: 28px auto;
    padding: 20px;
  }
  .card {
    background: #ffffff;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }
  header {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .clinic-logo {
    width: 72px;
    height: 72px;
    border-radius: 10px;
    background: #f3f7fb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #0b4c6b;
  }
  .clinic-info h1 {
    margin: 0;
    font-size: 20px;
    color: #0b4c6b;
  }
  .clinic-info p {
    margin: 2px 0;
    color: #6b7280;
    font-size: 13px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
  }
  .full {
    grid-column: 1 / -1;
  }
  label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }
  input[type='text'], input[type='date'], input[type='number'], select, textarea {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #e6eef3;
    border-radius: 8px;
    background: transparent;
    font-size: 14px;
    color: #111827;
  }
  textarea {
    min-height: 80px;
    resize: vertical;
    padding-top: 10px;
  }
  .vitals {
    display: flex;
    gap: 8px;
  }
  .vitals > div {
    flex: 1;
  }
  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 16px 0 8px;
  }
  .section-title h3 {
    margin: 0;
    font-size: 15px;
    color: #0f172a;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  th, td {
    padding: 8px;
    border: 1px solid #eef4f6;
    text-align: left;
    font-size: 14px;
  }
  th {
    background: #fbfdff;
    color: #6b7280;
    font-weight: 600;
  }
  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .btn {
    background: #0b4c6b;
    color: #fff;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
  }
  .btn.ghost {
    background: transparent;
    color: #0b4c6b;
    border: 1px solid rgba(11, 76, 107, 0.06);
  }
  .small {
    font-size: 13px;
    color: #6b7280;
  }
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
  }
  @media (max-width: 720px) {
    .grid {
      grid-template-columns: 1fr;
    }
    header {
      flex-direction: column;
      align-items: flex-start;
    }
    .clinic-logo {
      width: 56px;
      height: 56px;
    }
  }
  @media print {
    body {
      background: #fff;
    }
    .btn, .actions .ghost {
      display: none;
    }
    .container {
      max-width: 100%;
      padding: 0;
    }
    .card {
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }
  }
`;

const MedicalForm = ({ appointment, onSave, profileData, onShowHistory }) => {
  const { calculateAge } = useContext(AppContext);
  const [formData, setFormData] = useState({
    patientName: appointment.userData.name || '',
    patientContact: appointment.userData.phone || '',
    patientAge: calculateAge(appointment.userData.dob) || '',
    patientGender: appointment.userData.gender || 'Not Selected',
    patientAddress: appointment.userData.address ? `${appointment.userData.address.line1}, ${appointment.userData.address.line2}` : '',
    chiefComplaint: '',
    clinicalNotes: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    weight: '',
    prescriptions: [{ medicine: '', form: '', dosage: '', frequency: '', duration: '', notes: '' }],
    tests: '',
    diagnosis: '',
    advice: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[index] = { ...newPrescriptions[index], [name]: value };
    setFormData(prev => ({ ...prev, prescriptions: newPrescriptions }));
  };

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medicine: '', form: '', dosage: '', frequency: '', duration: '', notes: '' }]
    }));
  };

  const removePrescription = (index) => {
    if (formData.prescriptions.length > 1) {
      const newPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, prescriptions: newPrescriptions }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(appointment._id, formData);
  };
  
  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    if (window.confirm('Reset the form? All data will be lost.')) {
      setFormData({
        patientName: appointment.userData.name,
        patientContact: appointment.userData.phone,
        patientAge: calculateAge(appointment.userData.dob),
        patientGender: appointment.userData.gender,
        patientAddress: appointment.userData.address,
        chiefComplaint: '',
        clinicalNotes: '',
        bloodPressure: '',
        pulse: '',
        temperature: '',
        weight: '',
        prescriptions: [{ medicine: '', form: '', dosage: '', frequency: '', duration: '', notes: '' }],
        tests: '',
        diagnosis: '',
        advice: '',
      });
    }
  };

  return (
    <>
      <style>{medicalFormStyles}</style>
      <div className="container card">
        <header>
          <div className="clinic-logo">DR</div>
          <div className="clinic-info">
            <h1>Dr. {appointment.docData.name} — {appointment.docData.speciality}</h1>
            <p className="small">{appointment.docData.address.line1}, {appointment.docData.address.line2} • {profileData.phone} • {appointment.docData.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="small">Date: <strong id="pres-date">{new Date().toLocaleDateString()}</strong></div>
            <div className="small">Prescription ID: <strong>PR-{appointment._id.slice(0, 6)}</strong></div>
          </div>
        </header>

        <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid #eef4f6' }} />

        <form onSubmit={handleSubmit}>
          <div className="grid">
            <div>
              <label>Patient Name</label>
              <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="e.g., Meena K" />
            </div>
            <div>
              <label>Contact / Mobile</label>
              <input type="text" name="patientContact" value={formData.patientContact} onChange={handleInputChange} placeholder="+91 9XXXXXXXX" />
            </div>
            <div>
              <label>Age</label>
              <input type="number" name="patientAge" value={formData.patientAge} onChange={handleInputChange} min="0" placeholder="e.g., 28" />
            </div>
            <div>
              <label>Gender</label>
              <select name="patientGender" value={formData.patientGender} onChange={handleInputChange}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="full">
              <label>Address</label>
              <input type="text" name="patientAddress" value={formData.patientAddress} onChange={handleInputChange} placeholder="House/Street, City, Pincode" />
            </div>
            <div className="full">
              <label>Chief Complaint / Presenting Problem</label>
              <textarea name="chiefComplaint" value={formData.chiefComplaint} onChange={handleInputChange} placeholder="Patient complaint, duration, severity..."></textarea>
            </div>
            <div className="full">
              <label>Clinical Notes / History</label>
              <textarea name="clinicalNotes" value={formData.clinicalNotes} onChange={handleInputChange} placeholder="Relevant medical history, allergies, medications..."></textarea>
            </div>
            <div className="full">
              <div className="vitals">
                <div>
                  <label>Blood Pressure</label>
                  <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} placeholder="e.g., 120/80 mmHg" />
                </div>
                <div>
                  <label>Pulse</label>
                  <input type="text" name="pulse" value={formData.pulse} onChange={handleInputChange} placeholder="e.g., 78 bpm" />
                </div>
                <div>
                  <label>Temperature</label>
                  <input type="text" name="temperature" value={formData.temperature} onChange={handleInputChange} placeholder="e.g., 98.6 °F" />
                </div>
                <div>
                  <label>Weight</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g., 60 kg" />
                </div>
              </div>
            </div>
            <div className="full">
              <div className="section-title">
                <h3>Prescription / Medicines</h3>
                <div className="actions">
                  <button type="button" className="btn" onClick={addPrescription}>Add Medicine</button>
                  <button type="button" className="btn ghost" onClick={() => setFormData(prev => ({ ...prev, prescriptions: [{ medicine: '', form: '', dosage: '', frequency: '', duration: '', notes: '' }] }))}>Clear</button>
                </div>
              </div>
              <table>
                <thead>
                  <tr><th>Medicine</th><th>Form / Strength</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Notes</th><th></th></tr>
                </thead>
                <tbody>
                  {formData.prescriptions.map((p, index) => (
                    <tr key={index}>
                      <td><input type="text" name="medicine" value={p.medicine} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="e.g., Tab. Ferrous" /></td>
                      <td><input type="text" name="form" value={p.form} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="e.g., 325 mg" /></td>
                      <td><input type="text" name="dosage" value={p.dosage} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="e.g., 1 tablet" /></td>
                      <td><input type="text" name="frequency" value={p.frequency} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="e.g., Once daily" /></td>
                      <td><input type="text" name="duration" value={p.duration} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="e.g., 10 days" /></td>
                      <td><input type="text" name="notes" value={p.notes} onChange={(e) => handlePrescriptionChange(index, e)} placeholder="e.g., After food" /></td>
                      <td style={{ width: '40px', textAlign: 'center' }}><button type="button" className="btn ghost remove-row" onClick={() => removePrescription(index)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="full">
              <label>Investigations / Tests Ordered</label>
              <input type="text" name="tests" value={formData.tests} onChange={handleInputChange} placeholder="e.g., CBC, Ultrasound Pelvis" />
            </div>
            <div className="full">
              <label>Diagnosis / Impression</label>
              <textarea name="diagnosis" value={formData.diagnosis} onChange={handleInputChange} placeholder="Short diagnosis or impression..."></textarea>
            </div>
            <div className="full">
              <label>Advice / Follow-up</label>
              <textarea name="advice" value={formData.advice} onChange={handleInputChange} placeholder="Lifestyle advice, next appointment, warning signs..."></textarea>
            </div>
          </div>

          <footer>
            <div>
              <label>Doctor</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '6px' }}>
                <div style={{ minWidth: '150px' }}>
                  <input type="text" id="doctor-name" placeholder="Dr. Sabari" />
                  <div className="small">Gynecologist</div>
                </div>
                <div style={{ minWidth: '160px' }}>
                  <input type="text" id="doctor-reg" placeholder="Reg. No / License" />
                  <div className="small">Signature</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="small">Generated by i-Consult</div>
              <div style={{ marginTop: '8px' }}>
                <button type="button" className="btn ghost" onClick={() => onShowHistory(appointment.userId)}>History</button>
                <button type="button" className="btn" onClick={handlePrint}>Preview / Print</button>
                <button type="submit" className="btn ghost">Save & Complete</button>
                <button type="button" className="btn ghost" onClick={() => setShowPatientSearch(true)}>All Patients</button>
              </div>
            </div>
          </footer>
        </form>
      </div>
    </>
  );
};

const DoctorAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [viewingHistoryForm, setViewingHistoryForm] = useState(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, profileData, getProfileData } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
      getProfileData();
    }
  }, [dToken]);

  const handleCompleteClick = (item) => {
    setSelectedAppointment(item);
  };

  const handleFormSave = (appointmentId, formData) => {
    completeAppointment(appointmentId, formData);
    setSelectedAppointment(null);
    setShowHistory(false);
    setViewingHistoryForm(null);
  };

  const handleShowHistory = (patientId) => {
    // Find patient name from current appointments
    const appointment = appointments.find(apt => apt.userId === patientId);
    const patientName = appointment ? appointment.userData.name : 'Unknown Patient';
    
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setShowHistory(true);
  };

  const handleSelectPatientFromSearch = (patientId, patientName) => {
    setSelectedPatientId(patientId);
    setSelectedPatientName(patientName);
    setShowPatientSearch(false);
    setShowHistory(true);
  };

  const handleBackFromHistory = () => {
    setShowHistory(false);
    setSelectedPatientId(null);
    setSelectedPatientName('');
    setViewingHistoryForm(null);
  };

  const handleBackFromPatientSearch = () => {
    setShowPatientSearch(false);
  };

  const handleSelectHistoryForm = (appointment) => {
    setViewingHistoryForm(appointment);
  };

  const handleBackFromViewer = () => {
    setViewingHistoryForm(null);
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <div className="flex items-center justify-between mb-3">
        <p className='text-lg font-medium'>All Appointments</p>
        <button
          onClick={() => setShowPatientSearch(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
        >
          View Patient History
        </button>
      </div>
      {viewingHistoryForm ? (
        <EFormViewer appointment={viewingHistoryForm} onBack={handleBackFromViewer} />
      ) : showPatientSearch ? (
        <PatientSearch 
          onSelectPatient={handleSelectPatientFromSearch} 
          onBack={handleBackFromPatientSearch} 
        />
      ) : showHistory ? (
        <EFormHistory 
          patientId={selectedPatientId} 
          patientName={selectedPatientName}
          onBack={handleBackFromHistory} 
          onSelectForm={handleSelectHistoryForm}
        />
      ) : selectedAppointment && profileData ? (
        <MedicalForm 
          appointment={selectedAppointment} 
          onSave={handleFormSave} 
          profileData={profileData}
          onShowHistory={handleShowHistory}
        />
      ) : (
        <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
          <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>
          {appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index}</p>
              <div className='flex items-center gap-2'>
                <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
              </div>
              <div>
                <p className='text-xs inline border border-primary px-2 rounded-full'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>
              <p className='max-sm:hidden'>{item.userData.dob !== 'Not Selected' ? calculateAge(item.userData.dob) : 'N/A'}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => handleCompleteClick(item)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;

import React from 'react';

const CompleteAppointment = ({ appointmentId }) => {
  // Fetch appointment info or receive via route param or context
  return (
    <div className='w-full max-w-4xl m-5'>
      <h2 className='text-xl font-medium mb-4'>Complete Appointment</h2>
      <p>Appointment ID: {appointmentId}</p>
      {/* Add summary, doctor notes, prescription form, etc. */}
    </div>
  );
};

export default CompleteAppointment;

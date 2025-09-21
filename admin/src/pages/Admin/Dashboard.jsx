import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const appointmentsPerPage = 10;

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const getFilteredAppointments = () => {
    if (!dashData) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered = dashData.latestAppointments.filter(item => {
      const [day, month, year] = item.slotDate.split('_');
      const itemDate = new Date(year, month - 1, day);
      return itemDate >= today;
    });

    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-');
      const formattedDate = `${parseInt(day)}_${parseInt(month)}_${year}`;
      filtered = dashData.latestAppointments.filter(item => item.slotDate === formattedDate);
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * appointmentsPerPage, currentPage * appointmentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    dashData && (
      <div className='m-5'>
        <div className='flex flex-wrap gap-3'>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.doctor_icon} alt='' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
              <p className='text-gray-400'>Doctors</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.appointments_icon} alt='' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
              <p className='text-gray-400'>Appointments</p>
            </div>
          </div>
          <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
            <img className='w-14' src={assets.patients_icon} alt='' />
            <div>
              <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
              <p className='text-gray-400'>Patients</p>
            </div>
          </div>
        </div>

        <div className='bg-white'>
          <div className='flex items-center justify-between px-4 py-4 mt-10 rounded-t border'>
            <div className='flex items-center gap-2.5'>
              <img src={assets.list_icon} alt='' />
              <p className='font-semibold'>Latest Bookings</p>
            </div>
            <input type='date' value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className='border rounded px-2 py-1' />
          </div>

          <div className='pt-4 border border-t-0'>
            {paginatedAppointments.map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
                <img className='rounded-full w-10' src={item.docData.image} alt='' />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                  <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
                </div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt='' />
                )}
              </div>
            ))}
          </div>
          <div className='flex justify-center gap-4 py-4'>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className='px-4 py-2 border rounded disabled:opacity-50'>
              Previous
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className='px-4 py-2 border rounded disabled:opacity-50'>
              Next
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard
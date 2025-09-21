import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments, doctors, getAllDoctors } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [filterType, setFilterType] = useState('date');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
      getAllDoctors();
    }
  }, [aToken]);

  const getFilteredAppointments = () => {
    let filtered = appointments;

    if (filterType === 'date') {
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        filtered = appointments.filter(item => {
          const [day, month, year] = item.slotDate.split('_');
          const itemDate = new Date(year, month - 1, day);
          return itemDate >= from && itemDate <= to;
        });
      } else if (fromDate) {
        const from = new Date(fromDate);
        filtered = appointments.filter(item => {
          const [day, month, year] = item.slotDate.split('_');
          const itemDate = new Date(year, month - 1, day);
          return itemDate.toDateString() === from.toDateString();
        });
      }
    } else if (filterType === 'doctor') {
      if (selectedDoctor) {
        filtered = appointments.filter(item => item.docData._id === selectedDoctor);
        if (fromDate && toDate) {
          const from = new Date(fromDate);
          const to = new Date(toDate);
          filtered = filtered.filter(item => {
            const [day, month, year] = item.slotDate.split('_');
            const itemDate = new Date(year, month - 1, day);
            return itemDate >= from && itemDate <= to;
          });
        } else if (fromDate) {
          const from = new Date(fromDate);
          filtered = filtered.filter(item => {
            const [day, month, year] = item.slotDate.split('_');
            const itemDate = new Date(year, month - 1, day);
            return itemDate.toDateString() === from.toDateString();
          });
        }
      }
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className='w-full max-w-6xl m-5 '>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white p-4 border rounded mb-4'>
        <div className='flex items-center gap-4 mb-4'>
          <label>Filter by:</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className='border rounded px-2 py-1'>
            <option value='date'>Date</option>
            <option value='doctor'>Doctor</option>
          </select>
        </div>

        {filterType === 'date' && (
          <div className='flex items-center gap-4'>
            <input type='date' value={fromDate} onChange={e => setFromDate(e.target.value)} className='border rounded px-2 py-1' />
            <input type='date' value={toDate} onChange={e => setToDate(e.target.value)} className='border rounded px-2 py-1' />
          </div>
        )}

        {filterType === 'doctor' && (
          <div className='flex items-center gap-4'>
            <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} className='border rounded px-2 py-1'>
              <option value=''>Select Doctor</option>
              {doctors.map(doc => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
            <input type='date' value={fromDate} onChange={e => setFromDate(e.target.value)} className='border rounded px-2 py-1' />
            <input type='date' value={toDate} onChange={e => setToDate(e.target.value)} className='border rounded px-2 py-1' />
          </div>
        )}
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt='' /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{item.userData.dob !== 'Not Selected' ? calculateAge(item.userData.dob) : 'N/A'}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt='' /> <p>{item.docData.name}</p>
            </div>
            <p>{currency}{item.amount}</p>
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
    </div>
  );
};

export default AllAppointments;
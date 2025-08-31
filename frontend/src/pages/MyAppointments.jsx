import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
      setAppointments(data.appointments.reverse());
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verifyRazorpay`, response, { headers: { token } });
          if (data.success) {
            navigate('/my-appointments');
            getUserAppointments();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Payment verification failed');
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/payment-razorpay`, { appointmentId }, { headers: { token } });
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Razorpay payment failed');
    }
  };

  const appointmentCCAvenue = async (appointmentId, amount) => {
    try {
      // TODO: Replace with actual user data
      const { data } = await axios.post(`${backendUrl}/api/ccavenue/request`, {
        order_id: appointmentId,
        amount: amount,
        billing_name: 'Test User',
        billing_address: '123 Test St',
        billing_city: 'Test City',
        billing_state: 'TS',
        billing_zip: '123456',
        billing_country: 'India',
        billing_tel: '1234567890',
        billing_email: 'test@example.com',
      }, { headers: { token } });
      if (data.success) {
        const { encryptedOrderData, access_code } = data;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
        form.target = '_self';

        const encRequestInput = document.createElement('input');
        encRequestInput.type = 'hidden';
        encRequestInput.name = 'encRequest';
        encRequestInput.value = encryptedOrderData;
        form.appendChild(encRequestInput);

        const accessCodeInput = document.createElement('input');
        accessCodeInput.type = 'hidden';
        accessCodeInput.name = 'access_code';
        accessCodeInput.value = access_code;
        form.appendChild(accessCodeInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'CCAvenue payment failed');
    }
  };

  const handleDownloadPrescription = async (appointmentId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/prescription/${appointmentId}`, { headers: { token } });
      if (data.success) {

        const prescription = data.prescription;
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
          <html>
            <head>
              <title>Prescription</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 2rem; }
                h1 { text-align: center; }
                .prescription-field { margin-bottom: 1rem; }
                .prescription-field strong { display: block; }
                table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
              </style>
            </head>
            <body>
              <h1>Prescription</h1>
              <div class="prescription-field">
                <strong>Chief Complaint:</strong>
                <p>${prescription.chiefComplaint}</p>
              </div>
              <div class="prescription-field">
                <strong>Clinical Notes:</strong>
                <p>${prescription.clinicalNotes}</p>
              </div>
              <div class="prescription-field">
                <strong>Diagnosis:</strong>
                <p>${prescription.diagnosis}</p>
              </div>
              <div class="prescription-field">
                <strong>Medications:</strong>
                <table>
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Form / Strength</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${prescription.prescriptions.map(med => `
                      <tr>
                        <td>${med.medicine}</td>
                        <td>${med.form}</td>
                        <td>${med.dosage}</td>
                        <td>${med.frequency}</td>
                        <td>${med.duration}</td>
                        <td>${med.notes}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <div class="prescription-field">
                <strong>Investigations:</strong>
                <p>${prescription.tests}</p>
              </div>
              <div class="prescription-field">
                <strong>Advice / Follow-up:</strong>
                <p>${prescription.advice}</p>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download prescription');
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
            <div>
              <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-[#5E5E5E]'>
              <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-[#464646] font-medium mt-1'>Address:</p>
              <p>{item.docData.address.line1}</p>
              <p>{item.docData.address.line2}</p>
              <p className='mt-1'><span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end text-sm text-center'>
              {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                <>
                  <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" /></button>
                  <button onClick={() => appointmentCCAvenue(item._id, item.amount)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 transition-all duration-300 flex items-center justify-center'>Pay with CCAvenue</button>
                </>
              )}
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]'>Paid</button>}
              {item.isCompleted && (
                <>
                  <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>
                  <button onClick={() => handleDownloadPrescription(item._id)} className='sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Download Prescription</button>
                </>
              )}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;



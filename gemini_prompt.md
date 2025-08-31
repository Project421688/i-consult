### Gemini CLI Prompt:

Act as a full-stack developer to implement new features for the `i-consult` project.

### Part 1: Implement Prescription Download for Patients

This feature requires a button for completed appointments on the patient's dashboard to download their prescription.

**Backend (`i-consult/backend`)**

* **File:** `i-consult/backend/routes/userRoute.js`
* **Task:** Add a new GET route for fetching a single completed prescription.
    * `router.get('/prescription/:appointmentId', authUser, userController.getPrescription);`

* **File:** `i-consult/backend/controllers/userController.js`
* **Task:** Add a new `getPrescription` function.
    * This function should find the appointment by `req.params.appointmentId`.
    * It must verify that the appointment's `userId` matches `req.user._id` and that `isCompleted` is `true`.
    * If successful, respond with the appointment data including the `eForm`. If not, send a `404` or `401` error.

**Frontend (`i-consult/frontend`)**

* **File:** `i-consult/frontend/src/pages/MyAppointments.jsx`
* **Task:** Add a new "Download Prescription" button and its corresponding logic.
    * Inside the `appointments.map()` loop, conditionally render a button for each appointment where `item.isCompleted` is `true`.
    * Create an asynchronous function, `handleDownloadPrescription(appointmentId)`, which:
        * Makes an API call to the new backend endpoint: `/api/user/prescription/${appointmentId}`.
        * Upon receiving a successful response with the `eForm` data, it formats the data (e.g., using a new component or a library) and displays it in a printable format (e.g., in a new tab).

---

### Part 2: Implement Patient Medical History for Doctors

This feature allows a doctor to view a patient's past prescriptions when opening a new e-form.

**Backend (`i-consult/backend`)**

* **File:** `i-consult/backend/routes/doctorRoute.js`
* **Task:** Add a new GET route to retrieve a patient's medical history.
    * `router.get('/patient-history/:patientId', authDoctor, doctorController.getPatientHistory);`

* **File:** `i-consult/backend/controllers/doctorController.js`
* **Task:** Add a new `getPatientHistory` function.
    * This function should find all appointments for `req.params.patientId`.
    * It must filter the results to only include appointments where `isCompleted` is `true`.
    * Respond with an array of these completed appointments, each containing the `eForm` data.

**Frontend (`i-consult/admin`)**

* **File:** `i-consult/admin/src/pages/Doctor/DoctorAppointments.jsx`
* **Task:** Update the `MedicalForm` component to fetch and display the patient's medical history.
    * Add a new state variable to store the patient's history, e.g., `const [patientHistory, setPatientHistory] = useState([]);`.
    * Use `useEffect` to trigger an API call to `/api/doctor/patient-history/${appointment.userData._id}` when the `MedicalForm` component mounts.
    * Add a new section within the `MedicalForm`'s JSX to conditionally render the fetched `patientHistory` data in a readable format (e.g., a list or expandable cards).
import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    eForm: {
    patientName: { type: String },
    patientContact: { type: String },
    patientAge: { type: String },
    patientGender: { type: String },
    patientAddress: { type: String },
    chiefComplaint: { type: String },
    clinicalNotes: { type: String },
    bloodPressure: { type: String },
    pulse: { type: String },
    temperature: { type: String },
    weight: { type: String },
    prescriptions: [{
      medicine: { type: String },
      form: { type: String },
      dosage: { type: String },
      frequency: { type: String },
      duration: { type: String },
      notes: { type: String },
    }],
    tests: { type: String },
    diagnosis: { type: String },
    advice: { type: String },
  }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel
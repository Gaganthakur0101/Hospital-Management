import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({});

const doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default doctor;
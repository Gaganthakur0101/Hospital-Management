import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    doctorName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    fees: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    medicalLicenseNumber: {
        type: String,
        required: true,
        unique: true,
    }
});

const doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default doctor;

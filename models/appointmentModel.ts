import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null,
      required: false,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null,
    },
    symptoms: {
      type: String,
      default: "",
      trim: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    scheduledTime: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in_progress", "completed", "cancelled", "rejected"],
      default: "pending",
    },
    queueNumber: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ hospital: 1, doctor: 1, appointmentDate: 1, queueNumber: 1 }, { unique: true });
appointmentSchema.index({ patient: 1, appointmentDate: -1 });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

export default Appointment;

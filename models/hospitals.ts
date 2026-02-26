import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    registrationFees: {
      type: Number,
      required: true,
    },

    hospitalType: {
      type: String,
      enum: ["Government", "Private", "Clinic"],
      required: true,
    },

    description: {
      type: String,
    },

    establishedYear: {
      type: Number,
    },

    emergencyAvailable: {
      type: Boolean,
      default: false,
    },

    ambulanceAvailable: {
      type: Boolean,
      default: false,
    },

    specialities: {
      type: [String],
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const hospital =
  mongoose.models.Hospital ||
  mongoose.model("Hospital", hospitalSchema);

export default hospital; 
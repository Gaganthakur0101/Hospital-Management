import Mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["doctor", "patient"],
        default: "patient",
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password as string, salt);
});

const User = Mongoose.models.User || Mongoose.model("User", userSchema);

export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength : 16
    },
    isVerifed: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: {
        type: String,
        default: null,
    },
    forgotPasswordExpiry: {
        type: Date,
        default: null,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationTokenExpiry: {
        type: Date,
        default: null,
    },
},{
    timestamps: true,
})
// Since Mongoose caches models, we need to check if the model already exists before creating it.
const User = mongoose.model.users || mongoose.model("users", userSchema);
export default User;
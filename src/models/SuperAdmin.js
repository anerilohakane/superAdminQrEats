import mongoose from 'mongoose';

const SuperAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username/email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    cafeName: {
        type: String,
        required: [true, 'Please provide a cafe name'],
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'paused'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

delete mongoose.models.User;
export default mongoose.models.User || mongoose.model('User', UserSchema);

import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { isEmail } from 'validator';

const email = {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [isEmail, 'Email address is invalid']
}

const FriendsSchema = new mongoose.Schema({
    userEmail: {...email, unique: true },
    friends: [email],
    subscribers: [email],
    blocked: [email]
});

FriendsSchema.plugin(timestamps);

module.exports = mongoose.model('Friends', FriendsSchema);
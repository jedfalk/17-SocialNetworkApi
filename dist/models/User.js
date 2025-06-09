import { Schema, model } from 'mongoose';
const emailValidator = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [emailValidator, 'Must match an email address'],
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought', // <-- Capital T, matching model name
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User', // <-- Capital U, matching model name
        },
    ],
}, {
    toJSON: {
        virtuals: true,
    },
    timestamps: true,
});
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});
const User = model('User', userSchema);
export default User;

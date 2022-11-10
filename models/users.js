import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must add a username.']
    },
    email: {
        type: String,
        required: [true, 'You must add an email.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
},
{
    timestamps: true
})

const Users = mongoose.model('User', userSchema)

export default Users;
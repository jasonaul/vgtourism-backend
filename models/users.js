import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';


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
        required: [true, 'Please add a password with a minimum length of 7 characters.'],
        minlength: 7
    },
    image: { 
        type: String, 
        required: false
    },
    destinations: [{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Destination'
    }]


},
{
    timestamps: true
})

userSchema.plugin(mongooseUniqueValidator);

const Users = mongoose.model('Users', userSchema)

export default Users;
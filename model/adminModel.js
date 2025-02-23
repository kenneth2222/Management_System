const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    fullName: {
        type: String
    },

    email: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String
    },

    password:{
        type: String,
        required: true
    },

    isVerified:{
        type: Boolean,
        default:false
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isSuperAdmin: {
        type: Boolean,
        default: false
    },

    dateCreated: {
        type: Date,
        default: () => {
            const date = new Date
            return date.toISOString()
        }
    },

    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }],

    teachers:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'teacher'
        }

})
const adminModel = mongoose.model('admin', adminSchema)
module.exports = adminModel



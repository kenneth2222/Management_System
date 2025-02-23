const mongoose = require('mongoose');
const teacherSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password:{
        type: String,
        required:true
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

    admin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'admin'
        }

})
const teacherModel = mongoose.model('teacher', teacherSchema)
module.exports = teacherModel



const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: true
    },

    gender:{
        type:String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    phoneNumber:{
        type:String,
        required: true
    },

    password:{
        type:String,
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

    dateCreated:{
        type:Date,
        default:()=>{ const date = new Date
            return date.toISOString()
        }
    },

    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'teacher'
    },

   admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'admin'
    }

})
const studentModel = mongoose.model('student',studentSchema)
module.exports = studentModel


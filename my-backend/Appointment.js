const mongoose = require ("mongoose")
const {Schema} = mongoose
const appointmentSchema = new mongoose.Schema({
    student : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentor:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    request : {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    state : String,
    time : {
        type:Date,
        required:true
    }
})

module.exports = mongoose.model("Appointment", appointmentSchema)
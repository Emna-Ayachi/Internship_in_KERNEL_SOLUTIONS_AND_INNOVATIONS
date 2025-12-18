const mongoose = require ("mongoose")
const {Schema} = mongoose;
const rateSchema = new mongoose.Schema({
    student_id : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentor_id : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    value : {
        type: Number,
        min: 0,
        max: 5,
        required : true
    }
})

module.exports = mongoose.model("Rate",rateSchema)
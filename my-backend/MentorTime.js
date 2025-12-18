const mongoose = require ("mongoose")
const {Schema} = mongoose
const mentor_timeSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    end_time : {
        type: Date
    },
    start_time : {
        type: Date
    },
    money : {
        type: Number
    }
})

module.exports = mongoose.model("MentorTime", mentor_timeSchema)
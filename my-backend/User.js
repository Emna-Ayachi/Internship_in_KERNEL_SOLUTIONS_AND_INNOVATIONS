const mongoose = require ("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type :String,
        min : 3,
        required : true
    },
    surname : {
        type: String,
        required : true
    },
    mail : {
        type: String , 
        required : true
    },
    password : {
        type : String,
        required : true
    },
    function : {
        type: String,
        enum: ['student', 'mentor'],
    },
    uni :  {
        uni_name : String,
        position : String,
    },
    major : {
        major_name : String,
    },
    level : {
        type: Number,
        min : 1,
    }
})


module.exports = mongoose.model("User",userSchema)
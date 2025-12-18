const mongoose = require("mongoose");
const { Schema } = mongoose;

const requestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  time: {
    type: Date,
  },
  status:{ 
    type: String, 
    enum: ['pending', 'accepted', 'declined'], default: 'pending' 
  },
});

module.exports = mongoose.model("Request", requestSchema);

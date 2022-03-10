const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    channelname: { type: String, required: true },
    messages:[{
  name: { type: String, required: true },
      message: { type: String, required: true }
  
    }],
    person:{type:String,required:true, default:1}
  }
  
);

let Chat = mongoose.model("Message", chatSchema);

module.exports = Chat;

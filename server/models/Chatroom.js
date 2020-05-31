const mongoose = require("mongoose");

const ChatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
});

const Chatroom = mongoose.model("Chatroom", ChatroomSchema);

module.exports = Chatroom;

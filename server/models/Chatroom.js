const mongoose = require("mongoose");

const ChatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  totalSentimentScore: {
    type: Number,
    default: 0,
  },
  totalMessages: {
    type: Number,
    default: 0,
  },
  positive: {
    type: Number,
    default: 0,
  },
  neutral: {
    type: Number,
    default: 0,
  },
  negative: {
    type: Number,
    default: 0,
  },
});

const Chatroom = mongoose.model("Chatroom", ChatroomSchema);

module.exports = Chatroom;

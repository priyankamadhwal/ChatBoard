const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Channel is required!",
      ref: "Channel",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User is required!",
      ref: "User",
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      required: "Message is required!",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;

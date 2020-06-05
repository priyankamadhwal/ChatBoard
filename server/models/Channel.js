const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
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

const Channel = mongoose.model("Channel", ChannelSchema);

module.exports = Channel;

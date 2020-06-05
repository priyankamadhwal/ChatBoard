const mongoose = require("mongoose");
const Channel = mongoose.model("Channel");

exports.createChannel = async (req, res) => {
  const { name } = req.body;

  const nameRegex = /^[A-Za-z\s]+$/;

  if (!nameRegex.test(name)) throw "Channel name can contain only alphabets.";
  const channelExists = await Channel.findOne({ name });

  if (channelExists) throw "Channel with that name already exists!";

  const channel = new Channel({
    name,
  });

  await channel.save();

  res.json({
    message: "Channel created!",
  });
};

exports.getChannelSentiment = async (req, res) => {
  const channel = await Channel.findOne({
    _id: req.params.id,
  });

  if (!channel) throw "This channel does not exists!";

  res.json({
    totalSentimentScore: channel.totalSentimentScore,
    totalMessages: channel.totalMessages,
    positive: channel.positive,
    neutral: channel.neutral,
    negative: channel.negative,
  });
};

exports.getAllChannels = async (req, res) => {
  const channels = await Channel.find({});

  res.json(channels);
};

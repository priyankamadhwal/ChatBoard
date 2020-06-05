const mongoose = require("mongoose");
const Message = mongoose.model("Message");

exports.getAllMessagesInRoom = async (req, res) => {
  const messages = await Message.find({
    channel: req.params.channelId,
  }).populate({
    path: "user",
  });

  res.json(
    messages.map((currMessage) => {
      return {
        message: currMessage.message,
        username: currMessage.user.username,
        userId: currMessage.user._id,
      };
    })
  );
};

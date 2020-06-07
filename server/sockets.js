const mongoose = require("mongoose");
const jwt = require("jwt-then");
var Sentiment = require("sentiment");

const Message = mongoose.model("Message");
const User = mongoose.model("User");
const Channel = mongoose.model("Channel");

const {
  userJoins,
  userLeaves,
  getCurrentUser,
  getOnlineUsersInChannel,
} = require("./utils/onlineUsers");

let sockets = {};
let sentiment = new Sentiment();

sockets.init = (server) => {
  const ADMIN_ID = "admin";
  const ADMIN_USERNAME = "";

  const io = require("socket.io")(server);

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id;
      next();
    } catch (err) {}
  });

  // When user connects
  io.on("connection", (socket) => {
    // When user disconnects
    socket.on("disconnect", async ({ channelId }) => {
      const user = getCurrentUser(socket.userId);
      if (user) {
        socket.leave(user.channelId);
        userLeaves(socket.userId);
        const newMessage = {
          message: user.username + " left the channel!",
          username: ADMIN_USERNAME,
          userId: ADMIN_ID,
        };
        socket.broadcast.to(user.channelId).emit("newMessage", newMessage);
        io.to(user.channelId).emit("onlineUsers", {
          users: getOnlineUsersInChannel(user.channelId),
        });
      }
    });

    // When user joins a channel
    socket.on("joinChannel", async ({ username, channelId }) => {
      socket.join(channelId);
      userJoins(socket.userId, username, channelId);
      const newMessage = {
        message: username + " joined the channel!",
        username: ADMIN_USERNAME,
        userId: ADMIN_ID,
      };
      socket.broadcast.to(channelId).emit("newMessage", newMessage);
      io.to(channelId).emit("onlineUsers", {
        users: getOnlineUsersInChannel(channelId),
      });
    });

    // When user leaves a channel
    socket.on("leaveChannel", async ({ username, channelId }) => {
      socket.leave(channelId);
      userLeaves(socket.userId);
      const newMessage = {
        message: username + " left the channel!",
        username: ADMIN_USERNAME,
        userId: ADMIN_ID,
      };
      socket.broadcast.to(channelId).emit("newMessage", newMessage);
      io.to(channelId).emit("onlineUsers", {
        users: getOnlineUsersInChannel(channelId),
      });
    });

    // When user creates a new channel
    socket.on("newChannel", async ({ channelName }) => {
      const channel = await Channel.findOne({ name: channelName });
      if (channel) io.emit("newChannel", { channel });
    });

    // When user sends a new message
    socket.on("newMessage", async ({ username, channelId, message }) => {
      // Blank messages are ignored
      if (message.trim().length > 0) {
        const sentimentResult = sentiment.analyze(message);

        io.to(channelId).emit("newMessage", {
          message,
          username: username,
          userId: socket.userId,
          sentimentScore: sentimentResult.score,
        });

        const channel = await Channel.findOne({ _id: channelId });

        io.to(channelId).emit(
          "updateSentiment",
          getCurrentSentiment(channel, sentimentResult)
        );
        Channel.updateOne(
          { _id: channelId },
          {
            $set: getCurrentSentiment(channel, sentimentResult),
          },
          function (err, affected, resp) {}
        );

        const user = await User.findOne({ _id: socket.userId });
        User.updateOne(
          { _id: socket.userId },
          {
            $set: getCurrentSentiment(user, sentimentResult),
          },
          function (err, affected, resp) {}
        );

        const newMessage = new Message({
          channel: channelId,
          user: socket.userId,
          sentimentScore: sentimentResult.score,
          message,
        });

        await newMessage.save();
      }
    });
  });
};

const getCurrentSentiment = (entity, currSentimentResult) => {
  return {
    totalSentimentScore: entity.totalSentimentScore + currSentimentResult.score,
    totalMessages: entity.totalMessages + 1,
    positive: entity.positive + (currSentimentResult.score > 1 ? 1 : 0),
    neutral:
      entity.neutral +
      (currSentimentResult.score <= 1 && currSentimentResult.score >= -1
        ? 1
        : 0),
    negative: entity.negative + (currSentimentResult.score < -1 ? 1 : 0),
  };
};

module.exports = sockets;

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const errorHandler = require("./handlers/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Cross Origin
app.use(require("cors")());

// Setup mongoose
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

mongoose.connect(process.env.MONGODB_URL, (error) => {
  if (error) {
    console.log("Mongoose connection ERROR:", error.message);
  } else {
    console.log("Connected to database.");
  }
});

// Bring in the models
require("./models/User");
require("./models/Chatroom");
require("./models/Message");

// Bring in the routes
app.use("/user", require("./routes/user"));
app.use("/chatroom", require("./routes/chatroom"));
app.use("/messages", require("./routes/messages"));

// Setup error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.mongooseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandler.developmentErrors);
} else {
  app.use(errorHandler.productionErrors);
}

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}...`);
});

const io = require("socket.io")(server);
const jwt = require("jwt-then");
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const Chatroom = mongoose.model("Chatroom");
const ADMINID = "admin";

var Sentiment = require("sentiment");
var sentiment = new Sentiment();

const users = [];

// Join user to chat
function userJoin(id, username, chatroomId) {
  const index = users.findIndex((user) => user.id == id);
  if (index != -1) {
    const user = users[index];
    if (user.chatroomId == chatroomId) return;
    else {
      users.splice(index, 1);
    }
  }
  const user = { id, username, chatroomId };
  users.push(user);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id == id);
  if (index != -1) {
    users.splice(index, 1);
  }
}

// Get room users
function getRoomUsers(chatroomId) {
  return users.filter((user) => user.chatroomId === chatroomId);
}

function getCurrentUser(id) {
  return users.find((user) => user.id == id);
}

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {}
});

io.on("connection", (socket) => {
  //console.log("Connected: " + socket.userId);

  socket.on("disconnect", async ({ chatroomId }) => {
    const user = getCurrentUser(socket.userId);
    if (user) {
      const newMessage = {
        message: user.username + " left the channel!",
        username: "",
        userId: ADMINID,
      };
      socket.broadcast.to(user.chatroomId).emit("newMessage", newMessage);
      socket.leave(user.chatroomId);
      userLeave(socket.userId);
      io.to(user.chatroomId).emit("onlineUsers", {
        users: getRoomUsers(user.chatroomId),
      });
    }
  });

  socket.on("joinRoom", async ({ chatroomId }) => {
    const user = await User.findOne({ _id: socket.userId });
    userJoin(socket.userId, user.username, chatroomId);
    const newMessage = {
      message: user.username + " joined the channel!",
      username: "",
      userId: ADMINID,
    };
    socket.broadcast.to(chatroomId).emit("newMessage", newMessage);
    socket.join(chatroomId);
    // Send users and room info
    io.to(chatroomId).emit("onlineUsers", {
      users: getRoomUsers(chatroomId),
    });
  });

  socket.on("leaveRoom", async ({ chatroomId }) => {
    const user = await User.findOne({ _id: socket.userId });
    const newMessage = {
      message: user.username + " left the channel!",
      username: "",
      userId: ADMINID,
    };
    socket.broadcast.to(chatroomId).emit("newMessage", newMessage);
    socket.leave(chatroomId);
    userLeave(socket.userId);
    io.to(chatroomId).emit("onlineUsers", {
      users: getRoomUsers(chatroomId),
    });
  });

  socket.on("newMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const sentimentRes = sentiment.analyze(message);

      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        sentiment: sentimentRes,
        message,
      });

      io.to(chatroomId).emit("newMessage", {
        message,
        username: user.username,
        userId: socket.userId,
        sentiment: sentimentRes,
      });

      const chatroom = await Chatroom.findOne({ _id: chatroomId });
      Chatroom.updateOne(
        { _id: chatroomId },
        {
          $set: {
            totalSentimentScore:
              chatroom.totalSentimentScore + sentimentRes.score,
            totalMessages: chatroom.totalMessages + 1,
            positive: chatroom.positive + (sentimentRes.score > 1 ? 1 : 0),
            neutral:
              chatroom.neutral +
              (sentimentRes.score <= 1 && sentimentRes.score >= -1 ? 1 : 0),
            negative: chatroom.negative + (sentimentRes.score < -1 ? 1 : 0),
          },
        },
        function (err, affected, resp) {
          //if (err) console.log(err.message);
          //console.log(affected);
        }
      );

      io.to(chatroomId).emit("updateSentiment", {
        totalSentimentScore: chatroom.totalSentimentScore + sentimentRes.score,
        totalMessages: chatroom.totalMessages + 1,
        positive: chatroom.positive + (sentimentRes.score > 1 ? 1 : 0),
        neutral:
          chatroom.neutral +
          (sentimentRes.score <= 1 && sentimentRes.score >= -1 ? 1 : 0),
        negative: chatroom.negative + (sentimentRes.score < -1 ? 1 : 0),
      });

      User.updateOne(
        { _id: socket.userId },
        {
          $set: {
            totalSentimentScore: user.totalSentimentScore + sentimentRes.score,
            totalMessages: user.totalMessages + 1,
            positive: user.positive + (sentimentRes.score > 1 ? 1 : 0),
            neutral:
              user.neutral +
              (sentimentRes.score <= 1 && sentimentRes.score >= -1 ? 1 : 0),
            negative: user.negative + (sentimentRes.score < -1 ? 1 : 0),
          },
        },
        function (err, affected, resp) {
          //if (err) console.log(err.message);
          //console.log(affected);
        }
      );
      //await newMessage.save();
    }
  });
});

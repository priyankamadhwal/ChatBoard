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
require("./models/Channel");
require("./models/Message");

// Bring in the routes
app.use("/user", require("./routes/user"));
app.use("/channel", require("./routes/channel"));
app.use("/messages", require("./routes/messages"));

// Setup error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.mongooseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandler.developmentErrors);
} else {
  app.use(errorHandler.productionErrors);
}

// Start server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}...`);
});

// Initialize socket.io
var sockets = require("./sockets");
sockets.init(server);

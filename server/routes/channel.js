const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandler");
const channelController = require("../controllers/channelController");

const auth = require("../middlewares/auth");

router.get("/", auth, catchErrors(channelController.getAllChannels));
router.get(
  "/:id/sentiment",
  auth,
  catchErrors(channelController.getChannelSentiment)
);
router.post("/", auth, catchErrors(channelController.createChannel));

module.exports = router;

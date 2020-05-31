const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jwt-then");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

  if (!emailRegex.test(email)) throw "Email is not supported from your domain.";
  if (password.length < 6) throw "Password must be atleast 6 characters long.";

  const usernameExists = await User.findOne({
    username,
  });

  if (usernameExists) throw "User with same username already exits.";

  const emailExists = await User.findOne({
    email,
  });

  if (emailExists) throw "User with same email already exits.";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.json({
    message: "User [" + username + "] registered successfully!",
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    username,
  });

  if (!user) throw "User [" + username + "] doesn't exists.";

  const hashedPassword = await bcrypt.hash(password, 10);
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw "Password is incorrect.";

  const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: "1d",
  });

  res.json({
    message: "User logged in successfully!",
    token,
  });
};

exports.getUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
  });

  if (!user) throw "This user does not exists!";

  res.json(user);
};

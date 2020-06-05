// Maintain a list of online users
const users = [];

// User joins a channel
function userJoins(id, username, channelId) {
  const index = users.findIndex((user) => user.id == id);
  // If user is already present in the list and again joins the same channel, then do nothing
  // Else, first remove the user from the list and add him again with the new channel id
  if (index != -1) {
    const user = users[index];
    if (user.channelId == channelId) return;
    else {
      users.splice(index, 1);
    }
  }
  const user = { id, username, channelId };
  users.push(user);
}

// User leaves a channel
function userLeaves(id) {
  const index = users.findIndex((user) => user.id == id);
  // Remove user from list
  if (index != -1) {
    users.splice(index, 1);
  }
}

// Find the user with given id
function getCurrentUser(id) {
  return users.find((user) => user.id == id);
}

// Get all the online users in given channel
function getOnlineUsersInChannel(channelId) {
  return users.filter((user) => user.channelId === channelId);
}

module.exports = {
  userJoins,
  userLeaves,
  getCurrentUser,
  getOnlineUsersInChannel,
};

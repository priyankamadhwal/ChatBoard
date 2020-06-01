import React from "react";

import "./UsersList.css";

const UsersList = ({ onlineUsers }) => {
  return (
    <div className='usersList'>
      <h1>Users list</h1>
      <div>
        {onlineUsers.users
          ? onlineUsers.users.map((user, i) => <p key={i}>{user.username}</p>)
          : null}
      </div>
    </div>
  );
};

export default UsersList;

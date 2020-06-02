import React from "react";
import { Link, Switch, Route, withRouter } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import CreateNewChannel from "../createNewChannel/CreateNewChannel";

import "./ChatroomsList.css";

const ChatroomsList = ({ chatrooms }) => {
  return (
    <div className='chatroomsListOuterContainer'>
      <div className='chatroomsListInnerContainer'>
        <span className='channelsHeading'>Channels</span>
        <List className='chatroomsList'>
          {chatrooms.map((chatroom) => (
            <Link to={"/chatroom/" + chatroom._id} key={chatroom._id}>
              <ListItem button key={chatroom._id} className='chatroom'>
                <div>{chatroom.name}</div>
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
      <CreateNewChannel />
    </div>
  );
};

export default ChatroomsList;

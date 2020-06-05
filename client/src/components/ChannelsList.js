import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import NewChannel from "./NewChannel";

const ChannelsList = ({ channels }) => {
  return (
    <div className='channelsListOuterContainer'>
      <div className='channelsListInnerContainer'>
        <span className='channelsHeading'>Channels</span>
        <List className='channelsList'>
          {channels.map((channel) => (
            <Link to={"/channel/" + channel._id} key={channel._id}>
              <ListItem button key={channel._id} className='channel'>
                <div>{channel.name}</div>
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
      <NewChannel />
    </div>
  );
};

export default ChannelsList;

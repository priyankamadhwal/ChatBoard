import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import NewChannel from "./NewChannel";

const ChannelsList = ({ channels, socket }) => {
  const [allChannels, setAllChannels] = useState(channels);

  useEffect(() => {
    setAllChannels(channels);
  }, [channels]);

  return (
    <div className='channelsListOuterContainer'>
      <div>
        <h1 className='channelsListHeading'>Channels</h1>
        {allChannels ? (
          <List>
            {allChannels.map((channel, i) => (
              <Link to={"/channel/" + channel._id} key={i}>
                <ListItem button key={channel._id} className='channel'>
                  <div>{channel.name}</div>
                </ListItem>
              </Link>
            ))}
          </List>
        ) : null}
      </div>
      <NewChannel socket={socket} />
    </div>
  );
};

export default ChannelsList;

import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

import { POST } from "../utils/api";
import makeToast from "./Toaster";

const NewChannel = ({ socket }) => {
  const channelNameRef = React.createRef();

  const createChannel = () => {
    const channelName = channelNameRef.current.value;

    POST(
      "channel",
      { name: channelName },
      {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
      (response) => {
        makeToast("success", response.data.message);
        if (socket) {
          socket.emit("newChannel", { channelName });
        }
      },
      (err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      }
    );
    channelNameRef.current.value = "";
  };

  return (
    <div className='newChannelForm'>
      <h1 className='newChannelHeading'>Create new channel!</h1>
      <TextField
        className='newChannelTextField'
        type='text'
        name='channel-topic'
        placeholder='Enter a topic'
        variant='outlined'
        inputRef={channelNameRef}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <IconButton
                className='fas fa-plus-circle'
                onClick={createChannel}
              />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default NewChannel;

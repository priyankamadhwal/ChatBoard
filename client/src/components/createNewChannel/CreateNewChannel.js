import React from "react";
import { Link, Switch, Route, withRouter } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import axios from "axios";
import makeToast from "../Toaster";

import "./CreateNewChannel.css";

const CreateNewChannel = () => {
  const channelNameRef = React.createRef();

  const createChannel = () => {
    const channelName = channelNameRef.current.value;

    axios
      .post(
        "http://localhost:8000/channel",
        { name: channelName },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        makeToast("success", response.data.message);
        window.location.reload();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className='createNewChannelForm'>
      <span className='createNewChannelHeading'>Create new channel!</span>
      <form className='createNewChannelInput' autoComplete='off'>
        <TextField
          className='createNewChannelTextField'
          id='outlined-basic'
          type='text'
          name='message'
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
      </form>
    </div>
  );
};

export default CreateNewChannel;

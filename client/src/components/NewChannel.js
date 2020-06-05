import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";
import makeToast from "./Toaster";

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
      <div className='createNewChannelInput'>
        <TextField
          className='createNewChannelTextField'
          id='outlined-basic'
          type='text'
          name='channel-topic'
          placeholder='Enter a topic'
          variant='outlined'
          onSubmit={(event) => {
            event.key === "Enter" && event.peventDefault();
            alert("ok");
          }}
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
    </div>
  );
};

export default CreateNewChannel;

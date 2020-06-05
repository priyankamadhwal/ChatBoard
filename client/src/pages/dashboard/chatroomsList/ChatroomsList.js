import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import makeToast from "../../../components/Toaster";

import "./ChannelsList.css";

const ChannelsList = () => {
  const [channels, setChannels] = React.useState([]);
  const channelNameRef = React.createRef();

  const getChannels = () => {
    axios
      .get("http://localhost:8000/channel", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChannels(response.data);
      })
      .catch((err) => {
        setTimeout(getChannels, 3000);
      });
  };

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

  React.useEffect(() => {
    getChannels();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='channelsOuterContainer'>
      <div className='channelsHeading'>ChatBoard</div>
      <div>
        <div className='inputGroup'>
          <input
            type='text'
            name='channelName'
            id='channelName'
            ref={channelNameRef}
            placeholder='Enter channel name'
          />
        </div>
      </div>
      <button onClick={createChannel}>Create Channel</button>
      <div className='channels'>
        {channels.map((channel) => (
          <div key={channel._id} className='channel'>
            <div>{channel.name}</div>
            <Link to={"/channel/" + channel._id}>
              <div className='joinButton'>Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelsList;

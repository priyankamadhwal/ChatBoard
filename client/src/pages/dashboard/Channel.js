import React from "react";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Picker from "emoji-picker-react";

import Messages from "../../components/Messages";
import UsersList from "../../components/UsersList";
import ChannelSentimentAnalysis from "../../components/ChannelSentimentAnalysis";

import { GET } from "../../utils/api";

const Conversation = (props) => {
  const socket = props.socket;
  const [userId, setUserId] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [onlineUsers, setOnlineUsers] = React.useState([]);
  const [channelSentiment, setChannelSentiment] = React.useState(null);
  const [isEmojiPickerVisibile, setIsEmojiPickerVisibile] = React.useState(
    false
  );

  const getOldMessages = () => {
    GET(
      "messages/" + props.match.params.id,
      {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
      (response) => {
        setMessages(response.data);
      },
      (err) => {
        setTimeout(getOldMessages, 3000);
      }
    );
  };

  const sendMessage = (event) => {
    if (event) event.preventDefault();
    if (socket) {
      socket.emit("newMessage", {
        username: props.user.username,
        channelId: props.match.params.id,
        message: message,
      });
      setMessage("");
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const getChannelSentiment = () => {
    GET(
      "channel/" + props.match.params.id + "/sentiment",
      {
        Authorization: "Bearer " + localStorage.getItem("CC_Token"),
      },
      (response) => {
        setChannelSentiment(response.data);
      },
      (err) => {
        setTimeout(getChannelSentiment, 3000);
      }
    );
  };

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    //eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    getOldMessages();
    getChannelSentiment();

    if (socket) {
      socket.emit("joinChannel", {
        channelId: props.match.params.id,
        username: props.user.username,
      });
    } else {
      props.history.push("/dashboard");
    }

    return () => {
      if (socket) {
        socket.emit("leaveChannel", {
          channelId: props.match.params.id,
          username: props.user.username,
        });
      }
    };
    //eslint-disable-next-line
  }, [props.match.params.id]);

  React.useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    if (socket) {
      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
    //eslint-disable-next-line
  }, [onlineUsers]);

  React.useEffect(() => {
    if (socket) {
      socket.on("updateSentiment", (sentiment) => {
        setChannelSentiment(sentiment);
      });
    }
    //eslint-disable-next-line
  }, [props.channel]);

  return (
    <div className='outerContainer'>
      <div className='innerContainer'>
        <div className='emoji-picker'>
          {isEmojiPickerVisibile ? (
            <Picker onEmojiClick={onEmojiClick} />
          ) : null}
        </div>
        <Messages messages={messages} userId={userId} />
        <div className='sendMessageForm'>
          <form className='input' autoComplete='off'>
            <TextField
              className='messageInput'
              id='outlined-basic'
              type='text'
              name='message'
              placeholder='Type a message...'
              value={message}
              variant='outlined'
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onKeyPress={(event) =>
                event.key === "Enter" ? sendMessage(event) : null
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton
                      onClick={() =>
                        setIsEmojiPickerVisibile(!isEmojiPickerVisibile)
                      }
                    >
                      <Icon>emoji_emotions</Icon>
                    </IconButton>
                    <IconButton onClick={sendMessage}>
                      <Icon>send</Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
      </div>
      <div className='rightContent'>
        <UsersList onlineUsers={onlineUsers} />
        <ChannelSentimentAnalysis sentiment={channelSentiment} />
      </div>
    </div>
  );
};

export default withRouter(Conversation);

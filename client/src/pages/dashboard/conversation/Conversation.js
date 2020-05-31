import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import "emoji-mart/css/emoji-mart.css";
import Picker from "emoji-picker-react";
import ReactEmoji from "react-emoji";

import Messages from "./messages/Messages";
import Input from "./input/Input";

import "./Conversation.css";

const Conversation = (props) => {
  const chatroomId = props.match.params.id;
  const socket = props.socket;
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [msg, setMsg] = React.useState("");
  const [userId, setUserId] = React.useState("");
  const [chosenEmoji, setChosenEmoji] = React.useState(null);
  const [isEmojiPickerVisibile, setIsEmojiPickerVisibile] = React.useState(
    false
  );

  const onEmojiClick = (event, emojiObject) => {
    setMsg(msg + emojiObject.emoji);
  };

  React.useEffect(() => {
    //alert("mount");
    getOldMessages();
  }, [props.match.params.id]);

  React.useEffect(() => {
    return () => {
      //alert("unmount");
    };
  }, []);

  React.useEffect(() => {
    if (props.leaveRoom != 0) leaveRoom();
  }, [props.leaveRoom]);

  const getOldMessages = () => {
    axios
      .get("http://localhost:8000/messages/" + chatroomId, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setMessages(response.data);
      })
      .catch((err) => {
        //setTimeout(getOldMessages, 3000);
      });
  };

  const sendMessage = (event) => {
    if (event) event.preventDefault();
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: msg,
      });
      setMsg("");
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }

    if (socket) {
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
      });
    }
    //eslint-disable-next-line
  }, [messages]);

  React.useEffect(() => {
    //getOldMessages();
    if (socket) {
      socket.emit("joinRoom", {
        chatroomId,
      });
    }

    return () => {
      //Component Unmount
      leaveRoom();
    };
    //eslint-disable-next-line
  }, []);

  const leaveRoom = () => {
    if (socket) {
      socket.emit("leaveRoom", {
        chatroomId,
      });
    }
  };

  return (
    <div className='outerContainer'>
      <div className='emoji-picker'>
        {isEmojiPickerVisibile ? <Picker onEmojiClick={onEmojiClick} /> : null}
      </div>
      <Messages messages={messages} userId={userId} />
      <div className='sendMessageForm'>
        <form className='input' autocomplete='off'>
          <TextField
            id='outlined-basic'
            fullWidth
            type='text'
            name='message'
            placeholder='Type a message...'
            value={msg}
            variant='outlined'
            inputRef={messageRef}
            onChange={(e) => {
              setMsg(e.target.value);
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
  );
};

export default withRouter(Conversation);

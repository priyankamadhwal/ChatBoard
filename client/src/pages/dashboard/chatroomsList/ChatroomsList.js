import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import makeToast from "../../../components/Toaster";

import "./ChatroomsList.css";

const ChatroomsList = () => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const chatroomNameRef = React.createRef();

  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post(
        "http://localhost:8000/chatroom",
        { name: chatroomName },
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
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className='chatroomsOuterContainer'>
      <div className='chatroomsHeading'>ChatBoard</div>
      <div>
        <div className='inputGroup'>
          <input
            type='text'
            name='chatroomName'
            id='chatroomName'
            ref={chatroomNameRef}
            placeholder='Enter chatroom name'
          />
        </div>
      </div>
      <button onClick={createChatroom}>Create Chatroom</button>
      <div className='chatrooms'>
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className='chatroom'>
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className='joinButton'>Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatroomsList;

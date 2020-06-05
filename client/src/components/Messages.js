import React from "react";
import ReactEmoji from "react-emoji";

import ScrollToBottom from "react-scroll-to-bottom";

const Messages = ({ messages, userId }) => {
  return (
    <ScrollToBottom className='messages'>
      {messages.map((message, i) => (
        <div key={i}>
          {userId === message.userId ? (
            <div className='messageContainer justifyEnd'>
              <p className='sentText pr-10'>{message.username}</p>
              <div className='messageBox backgroundBlue'>
                <p className='messageText colorWhite'>
                  {ReactEmoji.emojify(message.message)}
                </p>
              </div>
            </div>
          ) : message.userId === "admin" ? (
            <div className='messageContainer justifyCenter'>
              <div className='messageBox backgroundWhite'>
                <p className='messageText colorAdmin'>{message.message}</p>
              </div>
              <p className='sentText pl-10 '>{message.username}</p>
            </div>
          ) : (
            <div className='messageContainer justifyStart'>
              <div className='messageBox backgroundLight'>
                <p className='messageText colorDark'>
                  {ReactEmoji.emojify(message.message)}
                </p>
              </div>
              <p className='sentText pl-10 '>{message.username}</p>
            </div>
          )}
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;

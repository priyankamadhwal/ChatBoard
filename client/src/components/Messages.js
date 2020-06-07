import React from "react";
import ReactEmoji from "react-emoji";
import ScrollToBottom from "react-scroll-to-bottom";

const Messages = ({ messages, userId }) => {
  const getContainerAlignment = (messageUserId) => {
    return userId === messageUserId
      ? "justifyEnd"
      : messageUserId === "admin"
      ? "justifyCenter"
      : "justifyStart";
  };

  const getMessageBackground = (messageSentimentScore) => {
    return messageSentimentScore > 1
      ? "backgroundGreen"
      : messageSentimentScore <= 1 && messageSentimentScore >= -1
      ? "backgroundYellow"
      : "backgroundRed";
  };

  return (
    <ScrollToBottom className='messages'>
      {messages.map((message, i) => (
        <div key={i}>
          <div
            className={
              "messageContainer " + getContainerAlignment(message.userId)
            }
          >
            {userId === message.userId ? (
              <p className='sentText pr-10'>{message.username}</p>
            ) : (
              ""
            )}
            <div
              className={
                "messageBox " +
                (message.userId === "admin"
                  ? "backgroundWhite"
                  : getMessageBackground(message.sentimentScore))
              }
            >
              <p
                className={
                  "messageText " +
                  (message.userId === "admin" ? "colorAdmin" : "colorUser")
                }
              >
                {ReactEmoji.emojify(message.message)}
              </p>
            </div>
            {userId !== message.userId ? (
              <p className='sentText pl-10'>{message.username}</p>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </ScrollToBottom>
  );
};

export default Messages;

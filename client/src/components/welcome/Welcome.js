import React from "react";
import ReactEmoji from "react-emoji";

import "./Welcome.css";

const Welcome = (props) => {
  return (
    <div className='welcomeOuterContainer'>
      <h1>Welcome!</h1>
      <p className='intro'>
        Don't miss out on the good stuff when you are just one chat away from
        your favorite topics {ReactEmoji.emojify("<3")}
      </p>
    </div>
  );
};

export default Welcome;

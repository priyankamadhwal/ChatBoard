import React from "react";

const Index = (props) => {
  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (!token) {
      props.history.push("/auth");
    } else {
      props.history.push("/dashboard");
    }
    // eslint-disable-next-line
  }, [0]);
  return <div></div>;
};

export default Index;

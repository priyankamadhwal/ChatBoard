import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import io from "socket.io-client";

import Authentication from "./pages/authentication/Authentication";
import Dashboard from "./pages/dashboard/Dashboard";
import Index from "./pages/Index";

import makeToast from "./components/Toaster";

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("connect", () => {
        //makeToast("success", "Socket Connected!");
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        //makeToast("error", "Socket Disconnected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Index} />
        <Route
          exact
          path='/auth'
          render={() => <Authentication setupSocket={setupSocket} />}
        />
        <Route
          exact
          path={["/dashboard", "/channel/:id"]}
          render={() => <Dashboard socket={socket} />}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

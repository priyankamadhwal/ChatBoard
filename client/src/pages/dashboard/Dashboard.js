import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import axios from "axios";
import { Link, Switch, Route, withRouter } from "react-router-dom";
import Conversation from "./conversation/Conversation";
import makeToast from "../../components/Toaster";
import ChatroomsList from "../../components/chatoomsList/ChatroomsList";
import Welcome from "../../components/welcome/Welcome";

import "./Dashboard.css";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      height: "10vh",
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: {
    color: "#fafbfc",
    fontSize: "2em",
    height: "15vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#1a1a1d",
  },
}));

const Dashboard = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [chatrooms, setChatrooms] = React.useState([]);
  const [leaveRoom, doLeaveRoom] = React.useState(0);
  const [currentChatroom, setCurrentChatroom] = React.useState(null);
  const chatroomNameRef = React.createRef();

  const loadCurrentChatroom = (chatrooms) => {
    const chatroom = chatrooms.filter(
      (chatroom) => chatroom._id === props.match.params.id
    )[0];
    setCurrentChatroom(chatroom);
  };

  const getUser = (userId) => {
    axios
      .get("http://localhost:8000/user/" + userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch((err) => {
        setTimeout(getUser, 3000);
      });
  };

  const getChatrooms = () => {
    axios
      .get("http://localhost:8000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
        loadCurrentChatroom(response.data);
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
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      getUser(payload.id);
    }
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    loadCurrentChatroom(chatrooms);
    // eslint-disable-next-line
  }, [props.match.params.id]);

  const logout = () => {
    doLeaveRoom(leaveRoom + 1);
    localStorage.removeItem("CC_Token");
    props.history.push("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <p className='headerName'>
          ChatBoard <Icon className='headerIcon'>mark_chat_read</Icon>
        </p>
        <p className='dashboardUsername'>
          {user ? "Hey " + user.username + "!" : ""}
        </p>
      </div>
      <Divider />
      <ChatroomsList chatrooms={chatrooms} />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position='fixed' className={classes.appBar}>
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' noWrap>
            {currentChatroom ? currentChatroom.name : "Join a channel!"}
          </Typography>
          <div onClick={logout}>
            <IconButton className='fas fa-power-off' />
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className='mainContent'>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path='/dashboard' render={Welcome} />
          <Route
            exact
            path='/chatroom/:id'
            render={() => (
              <Conversation
                socket={props.socket}
                user={user}
                chatroom={currentChatroom}
                leaveRoom={leaveRoom}
              />
            )}
          />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(Dashboard);

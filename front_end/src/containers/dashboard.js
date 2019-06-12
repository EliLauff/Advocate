import React from "react";
import SocketHandler from "../SocketHandler";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Router, Route, Switch } from "react-router-dom";
import history from "../history";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import KeyIcon from "@material-ui/icons/VpnKey";
import Home from "../components/home";
import ResumeIntro from "../components/resumeIntro";
import ContactInfo from "../components/contactInfo";
import WorkEntry from "../components/workEntry";
import WorkQuestion from "../components/workQuestion";
import EduEntry from "../components/eduEntry";
import EduQuestion from "../components/eduQuestion";
import Certifications from "../components/certifications";
import Languages from "../components/languages";
import ShowResume from "../components/showResume";
import NewUser from "../components/newUser";
import UserLink from "../components/userLink";
import ShowUser from "../components/showUser";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const drawerWidth = 240;

const socketIDs = [];

export class Dashboard extends React.Component {
  state = {
    visible: false,
    open: false,
    usersOpen: false,
    homeText_t: "",
    logoutText_t: "",
    usersText_t: "",
    inviteUserText_t: "",
    resumesText_t: "",
    createResumeText_t: "",
    sendLinkText_t: ""
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "dashboardTranslated",
        response => {
          this.setState({
            ...this.state,
            homeText_t: response.returnedHomeText,
            logoutText_t: response.returnedLogoutText,
            usersText_t: response.returnedUsersText,
            inviteUserText_t: response.returnedInviteUserText,
            resumesText_t: response.returnedResumesText,
            createResumeText_t: response.returnedCreateResumeText,
            visible: true
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "bioInfoRecieved",
        response => {
          console.log("bio info updated");
          console.log(response);
          this.setState({
            ...this.state,
            bioInfo: response.bioInfo
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "accountInfoReceived",
        response => {
          console.log("info updated");
          console.log(response);
          this.setState({
            ...this.state,
            accountInfo: response.accountInfo
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("activeBioSet", () => {
        setTimeout(() => {
          history.push("/showResume");
          this.props.forceMainBoxRender()
        }, 500);
      })
    );

    await SocketHandler.emit("requestAccountInfo");
    await SocketHandler.emit("requestBioInfo", {
      id: parseInt(localStorage.getItem("active_bio"))
    });
    await SocketHandler.emit("translateDashboard", {
      homeText: "Home Page",
      logoutText: "Leave",
      usersText: "Users",
      inviteUserText: "Invite user",
      resumesText: "Resumes",
      createResumeText: "Create new resume"
    });
  }

  async componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  logout = () => {
    this.setState({ visible: false });
    localStorage.clear();
    setTimeout(this.props.forceMainBoxRender, 500);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleUsersExpand = () => {
    this.setState({ usersOpen: !this.state.usersOpen });
  };

  handleResumesExpand = () => {
    this.setState({ resumesOpen: !this.state.resumesOpen });
  };

  setActiveBio = id => {
    SocketHandler.emit("setActiveBio", {
      id: id
    });
  };

  renderUsers = () => {
    let boxes = [];
    for (let user of this.state.accountInfo.accountUsers) {
      if (user.first_name && user.last_name){
        boxes.push(
          <ListItem
            button
            style={{ paddingLeft: "30px" }}
            onClick={() => this.showUser(user.uuid)}
          >
            <ListItemText>
              <Typography variant={"body1"}>
                {`${user.first_name} ${user.last_name}`}
              </Typography>
            </ListItemText>
          </ListItem>
        );
        }
    }
    console.log(boxes);
    return boxes;
  }

  renderBios = () => {
    let boxes = [];
    for (let bio of this.state.accountInfo.accountBios) {
      console.log(bio);
      if (bio.finished) {
        boxes.push(
          <ListItem
            button
            style={{ paddingLeft: "30px" }}
            onClick={() => this.setActiveBio(bio.id)}
          >
            <ListItemText>
              <Typography variant={"body1"}>
                {this.state.accountInfo.accountStuff.first_name} -{" "}
                {bio.createdAt.split("-")[1]}/{bio.createdAt.split("-")[0]}
              </Typography>
            </ListItemText>
          </ListItem>
        );
      }
    }
    console.log(boxes);
    return boxes;
  };

  renderToolbar() {
    if (this.state.accountInfo) {
      if (
        this.state.accountInfo.accountStuff.account_type === "advocate" ||
        this.state.accountInfo.accountStuff.has_account === true
      ) {
        return (
          <Toolbar disableGutters={!this.state.open} color={"white"}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h4"
              color="inherit"
              style={{
                fontFamily: "comfortaa",
                fontStyle: "light"
              }}
              noWrap
            >
              Advocate
            </Typography>
          </Toolbar>
        );
      } else {
        return (
          <Toolbar disableGutters={!this.state.open} color={"white"}>
            <div style={{ marginRight: "20px" }} />
            <Typography
              variant="h4"
              color="inherit"
              style={{
                fontFamily: "comfortaa",
                fontStyle: "light"
              }}
              noWrap
            >
              Advocate
            </Typography>
          </Toolbar>
        );
      }
    }
  }

  newResume = e => {
    setTimeout(() => {
      history.push("/newResume");
    }, 500);
  };

  newUser = e => {
    setTimeout(() => {
      history.push("/newUser");
    }, 500);
  };

  showUser = id => {
    setTimeout(() => {
      history.push(`/showUser/${id}`);
          this.props.forceMainBoxRender()
    }, 500);
  }

  renderMenu = () => {
    if (this.state.accountInfo) {
      if (this.state.accountInfo.accountStuff.account_type === "advocate") {
        return (
          <Drawer variant="persistent" anchor="left" open={this.state.open}>
            <div
              style={{
                maxWidth: `${drawerWidth}px`,
                minWidth: `${drawerWidth}px`
              }}
            >
              <div>
                <IconButton onClick={this.handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <div style={{ overflowY: "auto" }}>
                <List>
                  <ListItem
                    button
                    onClick={() =>
                      setTimeout(() => {
                        history.push("/");
                      }, 500)
                    }
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.homeText_t}
                      </Typography>
                    </ListItemText>
                    <HomeIcon />
                  </ListItem>
                  <Divider />
                  <ListItem
                    // button
                    onClick={this.handleUsersExpand}
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.usersText_t}
                      </Typography>
                    </ListItemText>
                    {this.state.usersOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={this.state.usersOpen}
                    timeout="auto"
                    unmountOnExit={true}
                  >
                    <List component="div" disablePadding>
                      {this.renderUsers()}
                      <ListItem
                        button
                        style={{ paddingLeft: "30px" }}
                        onClick={this.newUser}
                      >
                        <ListItemText>
                          <Typography variant={"body1"}>
                            {this.state.inviteUserText_t}
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                      </ListItem>
                    </List>
                  </Collapse>
                  <Divider />
                  <ListItem
                    // button
                    onClick={this.handleResumesExpand}
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.resumesText_t}
                      </Typography>
                    </ListItemText>
                    {this.state.resumesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={this.state.resumesOpen}
                    timeout="auto"
                    unmountOnExit={true}
                  >
                    <List component="div" disablePadding>
                      {this.renderBios()}
                      <ListItem
                        button
                        style={{ paddingLeft: "30px" }}
                        onClick={this.newResume}
                      >
                        <ListItemText>
                          <Typography variant={"body1"}>
                            {this.state.createResumeText_t}
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                      </ListItem>
                    </List>
                  </Collapse>
                  <Divider />
                  <ListItem
                    button
                    onClick={this.logout}
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.logoutText_t}
                      </Typography>
                    </ListItemText>
                    <KeyIcon />
                  </ListItem>
                  <Divider />
                </List>
              </div>
            </div>
          </Drawer>
        );
      } else if (
        this.state.accountInfo.accountStuff.account_type === "user" &&
        this.state.accountInfo.accountStuff.has_account === true
      ) {
        return (
          <Drawer variant="persistent" anchor="left" open={this.state.open}>
            <div
              style={{
                maxWidth: `${drawerWidth}px`,
                minWidth: `${drawerWidth}px`
              }}
            >
              <div>
                <IconButton onClick={this.handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>
              <Divider />
              <div style={{ overflowY: "auto" }}>
                <List>
                  <ListItem
                    button
                    onClick={() =>
                      setTimeout(() => {
                        history.push("/");
                      }, 500)
                    }
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.homeText_t}
                      </Typography>
                    </ListItemText>
                    <HomeIcon />
                  </ListItem>
                  <Divider />
                  <ListItem
                    // button
                    onClick={this.handleResumesExpand}
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.resumesText_t}
                      </Typography>
                    </ListItemText>
                    {this.state.resumesOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={this.state.resumesOpen}
                    timeout="auto"
                    unmountOnExit={true}
                  >
                    <List component="div" disablePadding>
                      {this.renderBios()}
                      <ListItem
                        button
                        style={{ paddingLeft: "30px" }}
                        onClick={this.newResume}
                      >
                        <ListItemText>
                          <Typography variant={"body1"}>
                            {this.state.createResumeText_t}
                          </Typography>
                        </ListItemText>
                        <ListItemIcon>
                          <AddIcon />
                        </ListItemIcon>
                      </ListItem>
                    </List>
                  </Collapse>
                  <Divider />
                  <ListItem
                    button
                    onClick={this.logout}
                    alignItems={"flex-start"}
                  >
                    <ListItemText>
                      <Typography variant={"body2"}>
                        {this.state.logoutText_t}
                      </Typography>
                    </ListItemText>
                    <KeyIcon />
                  </ListItem>
                  <Divider />
                </List>
              </div>
            </div>
          </Drawer>
        );
      }
    }
  };

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
          <div>
            <div>
              <AppBar position="sticky" color={"white"}>
                {this.renderToolbar()}
              </AppBar>
              {this.renderMenu()}
            </div>
            <Grid container spacing={3} >
              <Grid item xs={12} />
              <Router history={history}>
                <Switch>
                  <Route
                    path="/newResume"
                    component={ResumeIntro}
                  />
                  <Route
                    path="/contactInfo"
                    component={ContactInfo}
                  />
                  <Route
                    path="/workEntry"
                    component={WorkEntry}
                  />
                  <Route
                    path="/workQuestion"
                    component={WorkQuestion}
                  />
                  <Route
                    path="/eduEntry"
                    component={EduEntry}
                  />
                  <Route
                    path="/eduQuestion"
                    component={EduQuestion}
                  />
                  <Route
                    path="/certifications"
                    component={Certifications}
                  />
                  <Route
                    path="/languages"
                    component={Languages}
                  />
                  <Route
                    path="/showResume"
                    component={ShowResume}
                  />
                  <Route
                    path="/newUser"
                    component={NewUser}
                  />                  
                  <Route
                    path="/userLink"
                    component={UserLink}
                  />
                  <Route
                    path="/showUser/:id"
                    render={props => <ShowUser key={props.match.params.id} {...props}/>}
                  />
                  <Route
                    path=""
                    component={Home}
                  />
                </Switch>
              </Router>
            </Grid>
          </div>
        </Fade>
      </MuiPickersUtilsProvider>
    );
  }
}

import React from "react";
import SocketHandler from "../SocketHandler";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyIcon from "@material-ui/icons/VpnKey";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import history from "../history";
import AddIcon from "@material-ui/icons/Add";

const socketIDs = [];

export default class Home extends React.Component {
  state = {
    visible: false
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("homeTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          a_descriptorText_t: response.a_descriptorText,
          a_inviteBodyText_t: response.a_inviteBodyText,
          a_inviteButtonText_t: response.a_inviteButtonText,
          a_resumeBodyText_t: response.a_resumeBodyText,
          a_resumeButtonText_t: response.a_resumeButtonText,
          u_descriptorText_t: response.u_descriptorText,
          u_resumeBodyText_t: response.u_resumeBodyText,
          u_resumeButtonText_t: response.u_resumeButtonText,
          visible: true
        });
      })
    );
    await SocketHandler.emit("translateHome", {
      a_descriptorText: "Welcome to your helper dashboard.",
      a_inviteBodyText:
        "As a helper, you can invite someone to create a resume in their own language and then review it for them. You may also use the menu to do this.",
      a_inviteButtonText: "Invite a user",
      a_resumeBodyText:
        "You're able to create your own resumes here.  You may access them later using the menu at the left of the screen.",
      a_resumeButtonText: "Create a resume",
      u_descriptorText: "Welcome to your user dashboard.",
      u_resumeBodyText:
        "As a user, you can create an English resume by answering questions in your own language.  Click here to create a resume.",
      u_resumeButtonText: "Create a resume"
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  newResume = e => {
    this.setState({ visible: false });
    setTimeout(() => {
      history.push("/newResume");
    }, 500);
  };

  renderItems = () => {
    if (this.props.accountInfo) {
      if (this.props.accountInfo.accountStuff.account_type === "advocate") {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} />
            <Grid item xs={12} />
            <Grid item xs={1} md={2} />
            <Grid item xs={10} md={8} style={{ minHeight: "75px" }}>
              <div style={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  style={{ fontFamily: "comfortaa", fontStyle: "light" }}
                  gutterBottom
                >
                  {this.state.a_descriptorText_t}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={1} md={2} />
            <Grid item xs={false} md={2} />
            <Grid item xs={12} md={4} style={{ textAlign: "left" }}>
              <Paper>
                <Grid container>
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <Typography variant={"body1"}>
                      {this.state.a_resumeBodyText_t}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} />
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      style={{
                        fontStyle: "light",
                        height: "100%"
                      }}
                      onClick={this.newResume}
                    >
                      {this.state.a_resumeButtonText_t}
                      <KeyboardArrowRightIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} style={{ textAlign: "left" }}>
              <Paper>
                <Grid container>
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <Typography variant={"body1"}>
                      {this.state.a_inviteBodyText_t}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} />
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      style={{
                        fontStyle: "light",
                        height: "100%"
                      }}
                      onClick={() => console.log("invite user")}
                    >
                      {this.state.a_inviteButtonText_t}
                      <AddIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={false} md={2} />
          </Grid>
        );
      } else {
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} />
            <Grid item xs={12} />
            <Grid item xs={1} md={2} />
            <Grid item xs={10} md={8} style={{ minHeight: "75px" }}>
              <div style={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  style={{ fontFamily: "comfortaa", fontStyle: "light" }}
                  gutterBottom
                >
                  {this.state.u_descriptorText_t}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={1} md={2} />
            <Grid item xs={false} md={4} />
            <Grid item xs={12} md={4} style={{ textAlign: "left" }}>
              <Paper>
                <Grid container>
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <Typography variant={"body1"}>
                      {this.state.u_resumeBodyText_t}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} />
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      fullWidth
                      style={{
                        fontStyle: "light",
                        height: "100%"
                      }}
                      onClick={this.newResume}
                    >
                      {this.state.u_resumeButtonText_t}
                      <KeyboardArrowRightIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} />
          </Grid>
        );
      }
    }
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container>{this.renderItems()}</Grid>
      </Fade>
    );
  }
}

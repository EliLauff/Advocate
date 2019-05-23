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

const socketIDs = [];

export default class Home extends React.Component {
  state = {
    visible: false
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("homeTranslated", response => {
        this.setState({
          ...this.state,
          visible: true
        });
      })
    );
    await SocketHandler.emit("translateHome", {
      a_descriptorText: "Welcome to your helper dashboard.",
      a_inviteBodyText:
        "As a helper, you can invite someone to create a resume in their own language and then review it for them. You may also use the menu to do this.  Users you invite will show up in your menu.",
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

  renderItems = () => {
    if (this.props.accountInfo.account_type === "user") {
      return <Typography variant={"h1"}>In here</Typography>;
    }
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit>
        <Grid container spacing={24}>
          <Grid item xs={12} />
          <Grid item xs={12} />
          <Grid item xs={12} />
          <Grid item xs={1} md={2} />
          <Grid item xs={10} md={8} style={{ minHeight: "100px" }}>
            <div style={{ textAlign: "center" }}>
              <Typography
                variant="h3"
                style={{ fontFamily: "comfortaa", fontStyle: "light" }}
                gutterBottom
              >
                {this.state.descriptorText_t}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={1} md={2} />
          <Grid item xs={false} md={2} />
          <Grid item xs={12} md={4} style={{ textAlign: "center" }}>
            <Paper>
              <Grid container>
                <Grid item xs={12} style={{ marginTop: "10px" }}>
                  <Typography variant={"h4"}>
                    {this.state.signupHeaderText_t}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "left" }}>
                  <form>
                    <Grid container>
                      <Grid item xs={1} />
                      <Grid item xs={10} />
                      <Grid item xs={1} />
                      <Grid item xs={1} />
                      <Grid item xs={10} />
                      <Grid item xs={1} />
                      <Grid item xs={1} />
                      <Grid item xs={10} style={{ marginBottom: "30px" }} />
                      <Grid item xs={1} />
                      <Grid item xs={12} />
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} style={{ textAlign: "center" }}>
            <Paper>
              {this.renderItems()}
              <Grid container>
                <Grid
                  item
                  xs={12}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Typography variant={"h4"}>
                    {this.state.loginHeaderText_t}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }} />
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={false} md={2} />
        </Grid>
      </Fade>
    );
  }
}

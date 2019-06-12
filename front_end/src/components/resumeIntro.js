import React from "react";
import SocketHandler from "../SocketHandler";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import history from "../history";

const socketIDs = [];

export default class ResumeIntro extends React.Component {
  state = {
    visible: false,
    headerText_t: "",
    descriptorText_t: "",
    buttonText_t: ""
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          headerText_t: response.headerText,
          descriptorText_t: response.descriptorText,
          buttonText_t: response.buttonText,
          visible: true
        });
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("bioCreated", response => {
        localStorage.setItem("active_bio", response.createdBio.id);
        SocketHandler.emit("updateUser", {
          active_bio_id: response.createdBio.id
        });
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("userUpdated", () => {
        setTimeout(() => {
          history.push("/contactInfo");
        }, 500);
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("accountInfoReceived", (response)=>{
        this.setState({...this.state, accountInfo:response.accountInfo})
        SocketHandler.emit("translateText", {
          headerText:
            "Welcome to Advocate.  This is a resume builder designed for non-native english speakers.",
          descriptorText:
            "The resume builder will ask you a series of questions.  Answer them as clearly and as simply as possible.",
          buttonText: "Continue"
        });
      })
    )
    await SocketHandler.emit("requestAccountInfo");
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  handleSubmit = e => {
    this.setState({ visible: false });
    SocketHandler.emit("createNewBio");
  };

  renderItems = () => {
    if (this.state.accountInfo) {
      if (
        this.state.accountInfo.accountStuff.account_type === "advocate" ||
        this.state.accountInfo.accountStuff.has_account === true
      ) {
        return (
          <Grid container spacing={3} >
            <Grid item xs={12} />
            {/* <Grid item xs={12} /> */}
            <Grid item xs={false} md={3} />
            <Grid item xs={12} md={6} style={{ textAlign: "left" }}>
              <Paper>
                <Grid container>
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}
                  >
                    <Typography variant={"body2"}>
                      {this.state.descriptorText_t}
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
                      onClick={this.handleSubmit}
                    >
                      {this.state.buttonText_t}
                      <KeyboardArrowRightIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} />
          </Grid>
        );
      } else {
        return (
          <Grid container spacing={3} >
            <Grid item xs={12} /> <Grid item xs={1} md={2} />
            <Grid item xs={10} md={8} style={{ minHeight: "75px" }}>
              <div style={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  style={{ fontFamily: "comfortaa", fontStyle: "light" }}
                  gutterBottom
                >
                  {this.state.headerText_t}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={1} md={2} />
            <Grid item xs={false} md={3} />
            <Grid item xs={12} md={6} style={{ textAlign: "left" }}>
              <Paper>
                <Grid container>
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "10px", textAlign: "center" }}
                  >
                    <Typography variant={"body2"}>
                      {this.state.descriptorText_t}
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
                      onClick={this.handleSubmit}
                    >
                      {this.state.buttonText_t}
                      <KeyboardArrowRightIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} />
          </Grid>
        );
      }
    }
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container >{this.renderItems()}</Grid>
      </Fade>
    );
  }
}

import React from "react";
import SocketHandler from "../SocketHandler";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import history from "../history";

const socketIDs = [];

export default class EduQuestion extends React.Component {
  state = {
    visible: false
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "eduEntryCreated",
        response => {
          localStorage.setItem("eduEntry_id", response.newEduEntry.id);
          SocketHandler.emit("requestBioInfoEdu", {
            id: parseInt(localStorage.getItem("active_bio"))
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("renderEduPage", () => {
        for (let i = 0; i < socketIDs.length; i++) {
          SocketHandler.unregisterSocketListener(socketIDs[i]);
        }
        setTimeout(() => {
          history.push("/eduEntry");
        }, 500);
      })
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "workEntryCreated",
        response => {
          localStorage.setItem("workEntry_id", response.newWorkEntry.id);
          SocketHandler.emit("requestBioInfoWork", {
            id: parseInt(localStorage.getItem("active_bio"))
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("renderWorkPage", () => {
        for (let i = 0; i < socketIDs.length; i++) {
          SocketHandler.unregisterSocketListener(socketIDs[i]);
        }
        setTimeout(() => {
          history.push("/workEntry");
        }, 500);
      })
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          descriptorText_t: response.descriptorText,
          yesHeaderText_t: response.yesHeaderText,
          yesDescriptorText_t: response.yesDescriptorText,
          noHeaderText_t: response.noHeaderText,
          noDescriptorText_t: response.noDescriptorText,
          goBackText_t: response.goBackText,
          visible: true
        });
      })
    );
    await SocketHandler.emit("requestAccountInfo");
    // await SocketHandler.emit("requestBioInfo", {
    //   id: parseInt(localStorage.getItem("active_bio"))
    // });
    await SocketHandler.emit("translateText", {
      descriptorText:
        "Is there additional educational experience that you would like to record on your resume?",
      yesHeaderText: "Yes",
      yesDescriptorText: "I want to record more of my educational background.",
      noHeaderText: "No",
      noDescriptorText:
        "I have already provided all relevant educational experience.",
      goBackText: "Go back"
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  handleYes = () => {
    this.setState({ visible: false });
    SocketHandler.emit("createEduEntry", {
      bio_id: parseInt(localStorage.getItem("active_bio"))
    });
  };

  handleNo = () => {
    this.setState({ visible: false });
    SocketHandler.emit("createWorkEntry", {
      bio_id: parseInt(localStorage.getItem("active_bio"))
    });
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container spacing={3} >
          <Grid item xs={6} />
          <Grid item xs={6} style={{ textAlign: "right" }} />
          <Grid item xs={12} />
          <Grid item xs={1} md={2} />
          <Grid item xs={10} md={8} style={{ minHeight: "75px" }}>
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
          <Grid item xs={false} md={3} />
          <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
            <Button
              onClick={this.handleYes}
              variant="contained"
              fullWidth
              style={{
                fontFamily: "Open Sans",
                fontStyle: "light",
                textTransform: "none",
                height: "100%"
              }}
            >
              <Grid container>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant="h4">
                    {this.state.yesHeaderText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant="body1">
                    {this.state.yesDescriptorText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
              </Grid>
            </Button>
          </Grid>
          <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
            <Button
              onClick={this.handleNo}
              variant="contained"
              fullWidth
              style={{
                fontFamily: "Open Sans",
                fontStyle: "light",
                textTransform: "none",
                height: "100%"
              }}
            >
              <Grid container>
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant="h4">
                    {this.state.noHeaderText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant="body1">
                    {this.state.noDescriptorText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
              </Grid>
            </Button>
          </Grid>
          <Grid item xs={false} md={3} />
        </Grid>
      </Fade>
    );
  }
}

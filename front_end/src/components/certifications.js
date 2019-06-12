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
import Divider from "@material-ui/core/Divider";

const socketIDs = [];

export default class Certifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      certifications: []
    };

  }

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          headerText_t: response.headerText,
          certificationsDescriptorText_t: response.certificationsDescriptorText,
          certificationsLabelText_t: response.certificationsLabelText,
          certButtonText_t: response.certButtonText,
          submitButtonText_t: response.submitButtonText,
          visible: true
        });
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "certsAdded",
        response => {
          console.log(response);
          SocketHandler.emit("createEduEntry", {
            bio_id: parseInt(localStorage.getItem("active_bio"))
          });
        }
      )
    );
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
        setTimeout(() => {
          history.push("/eduEntry");
        }, 500);
      })
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener("accountInfoReceived", (response)=>{
        console.log(response)
        this.setState({...this.state, accountInfo:response.accountInfo, numCerts:
          response.accountInfo.accountCerts.length > 0
            ? response.accountInfo.accountCerts.length
            : 1})
            if (response.accountInfo.accountCerts.length > 0) {
              let n = 0;
              while (n < this.state.numCerts) {
                this.state = {
                  ...this.state,
                  [`cert_${n}`]: response.accountInfo.accountCerts[n].description
                };
                n++;
              }
            }
        this.setState({...this.state, checkVar: true})
        SocketHandler.emit("translateText", {
          headerText:
            "If applicable, please use the form below to record any certifications you have earned.",
          certificationsDescriptorText:
            "If applicable, please list any and each professional certification that you have earned. (For example: 'Forklift', 'HVAC', 'CDL', 'TWIC Card', etc.). Please place only one certification on each line and press the button below to add more lines as needed.",
          certificationsLabelText: "Certification earned: ",
          certButtonText: "Add another certification",
          submitButtonText: "Continue"
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
    let certData = [];
    for (let keyText in this.state) {
      if (keyText.includes("cert_")) {
        certData.push(this.state[keyText]);
      }
    }
    console.log(certData);
    SocketHandler.emit("addCerts", {
      certData: certData
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleStartDateChange = date => {
    this.setState({ startDate: date });
  };

  handleFinishDateChange = date => {
    this.setState({ finishDate: date });
  };

  incrementNumCerts = () => {
    this.setState({
      numCerts: this.state.numCerts + 1
    });
    this.forceUpdate();
  };

  renderCertBoxes = () => {
    let boxes = [];
    for (let i = 0; i < this.state.numCerts; i++) {
      console.log("rendering box");
      boxes.push(
        <TextField
          id={`cert_${i}`}
          name={`cert_${i}`}
          label={this.state.certificationsLabelText_t}
          value={this.state[`cert_${i}`]}
          onChange={this.handleChange(`cert_${i}`)}
          margin="normal"
          fullWidth
        />
      );
    }
    return boxes;
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container >
          <Grid container spacing={3}>
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
                  <Grid
                    item
                    xs={12}
                    style={{ marginTop: "10px", marginBottom: "10px" }}
                  >
                    <form>
                      <Grid container>
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "30px", marginBottom: "25px" }}
                          >
                            {this.state.certificationsDescriptorText_t}
                          </Typography>
                          <Grid container>
                            <Grid item xs={7}>
                              {this.renderCertBoxes()}
                            </Grid>

                            <Grid item xs={1} />
                            <Grid item xs={4} style={{ position: "relative" }}>
                              <Button
                                type="button"
                                variant="contained"
                                style={{
                                  position: "absolute",
                                  fontStyle: "light",
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  bottom: "0px"
                                }}
                                onClick={this.incrementNumCerts}
                                fullWidth
                              >
                                {this.state.certButtonText_t}
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={1} />
                      </Grid>
                    </form>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      style={{
                        fontStyle: "light",
                        height: "100%"
                      }}
                      onClick={this.handleSubmit}
                    >
                      {this.state.submitButtonText_t}
                      <KeyboardArrowRightIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3} />
          </Grid>
        </Grid>
      </Fade>
    );
  }
}

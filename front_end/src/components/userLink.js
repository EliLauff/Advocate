import React from "react";
import SocketHandler from "../SocketHandler";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Hidden from "@material-ui/core/Hidden";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import history from "../history";
import { CopyToClipboard } from "react-copy-to-clipboard";

const socketIDs = [];

export default class UserLink extends React.Component {
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
          linkText_t: response.linkText,
          userLink: `http://34.73.209.106/userSetup?token=${localStorage.getItem(
            "userLink"
          )}`,
          linkButtontext_t: response.linkButtonText,
          visible: true
        });
      })
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "accountInfoReceived",
        response => {
          this.setState({...this.state, accountInfo: response.accountInfo})
          SocketHandler.emit("translateText", {
            headerText: "User Account Created!",
            descriptorText:
              "The link on this page will allow the new user to access their account.  Copy, paste and send it in whatever manner you desire.",
            buttonText: "Back to home",
            linkText: "Secure User Link: ",
            linkButtonText: "Copy link to clipboard"
          });
        }
      )
    );

    

    await SocketHandler.emit("requestAccountInfo");
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = e => {
    this.setState({ visible: false });
    setTimeout(() => {
      history.push("/");
    });
  };

  renderItems = () => {
    if (this.state.accountInfo) {
      if (this.state.accountInfo.accountStuff.account_type === "advocate") {
        return (
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
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "30px", marginBottom: "10px" }}
                  >
                    <Typography variant={"body2"}>
                      {this.state.descriptorText_t}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} />
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "20px" }}
                  >
                    <Typography variant={"body2"}>
                      {this.state.linkText_t}
                    </Typography>
                    <Typography variant={"body1"} noWrap>
                      {this.state.userLink}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} />
                  <Grid item xs={1} />
                  <Grid
                    item
                    xs={10}
                    style={{ marginTop: "10px", marginBottom: "50px" }}
                  >
                    <CopyToClipboard text={this.state.userLink}>
                      <Button variant="contained">
                        {this.state.linkButtontext_t}
                      </Button>
                    </CopyToClipboard>
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

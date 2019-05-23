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
import history from "../history";

const mapStateToProps = state => {
  return {
    language: localStorage.getItem("language") || state.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectUserType: userType =>
      dispatch({ type: "SELECT_USER_TYPE", payload: { userType: userType } }),
    setLanguage: language =>
      dispatch({ type: "SET_LANGUAGE", payload: { language: language } })
  };
};

const myConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);

let socketID = null;

class _UserSelect extends React.Component {
  state = {
    visible: false,
    language: "",
    descriptorText_t: "",
    advocateHeaderText_t: "",
    advocateDescriptorText_t: "",
    userHeaderText_t: "",
    userDescriptorText_t: "",
    loginText_t: "",
    goBackText_t: ""
  };

  async componentDidMount() {
    socketID = await SocketHandler.registerSocketListener(
      "userSelectTranslated",
      response => {
        this.setState({
          ...this.state,
          descriptorText_t: response.returnedDescriptor,
          advocateHeaderText_t: response.returnedAdvocateHeader,
          advocateDescriptorText_t: response.returnedAdvocateDescriptor,
          userHeaderText_t: response.returnedUserHeader,
          userDescriptorText_t: response.returnedUserDescriptor,
          loginText_t: response.returnedLoginText,
          goBackText_t: response.returnedGoBackText,
          visible: true
        });
      }
    );
    await SocketHandler.emit("translateUserSelect", {
      language: this.props.language,
      descriptorText: "What type of user are you?",
      advocateHeaderText: "Helper",
      advocateDescriptorText: "I want to help someone else create a resume.",
      userHeaderText: "User",
      userDescriptorText: "I want to build a professional resume for myself.",
      loginText: "Log in",
      goBackText: "Go back"
    });
  }

  componentWillUnmount() {
    SocketHandler.unregisterSocketListener(socketID);
  }

  handleClick = userType => {
    this.setState({ visible: false });
    setTimeout(() => {
      history.push(`/${userType}Signup`);
    }, 500);
  };

  handleBack = () => {
    this.setState({ visible: false });
    localStorage.setItem("language", "en");
    this.props.setLanguage("en");
    setTimeout(() => {
      history.goBack();
    }, 500);
  };

  requestLogin = () => {
    this.setState({ ...this.state, visible: false });
    setTimeout(() => {
      history.push("/loginForm");
    }, 500);
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Button size="small" onClick={this.handleBack}>
              <KeyboardArrowLeftIcon />
              {this.state.goBackText_t}
            </Button>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Button size="small" onClick={this.requestLogin}>
              {this.state.loginText_t}
              <KeyIcon style={{ marginLeft: "5px" }} />
            </Button>
          </Grid>
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
          <Grid item xs={false} md={3} />
          <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
            <Button
              onClick={() => this.handleClick("user")}
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
                    {this.state.userHeaderText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant="body1">
                    {this.state.userDescriptorText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
              </Grid>
            </Button>
          </Grid>
          <Grid item xs={12} md={3} style={{ textAlign: "center" }}>
            <Button
              onClick={() => this.handleClick("advocate")}
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
                    {this.state.advocateHeaderText_t}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant="body1">
                    {this.state.advocateDescriptorText_t}
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

export const UserSelect = myConnector(_UserSelect);

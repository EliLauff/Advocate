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
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const mapStateToProps = state => {
  return {
    language: localStorage.getItem("language") || state.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectUserType: userType =>
      dispatch({ type: "SELECT_USER_TYPE", payload: { userType: userType } })
  };
};

const myConnector = connect(
  mapStateToProps,
  mapDispatchToProps
);

const socketIDs = [];

class _LoginForm extends React.Component {
  state = {
    visible: false,
    password: "",
    email: "",
    invalidLogin: false
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("invalidLogin", response => {
        this.setState({
          ...this.state,
          invalidLogin: true
        });
      })
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "loginTranslated",
        response => {
          this.setState({
            ...this.state,
            descriptorText_t: response.returnedDescriptor,
            passwordLabelText_t: response.returnedPasswordLabel,
            loginText_t: response.returnedLoginText,
            goBackText_t: response.returnedGoBackText,
            emailLabelText_t: response.returnedEmailLabelText,
            requiredFieldText_t: response.requiredFieldText,
            validEmailText_t: response.validEmailText,
            passwordLengthText_t: response.passwordLengthText,
            passwordMatchText_t: response.passwordMatchText,
            authenticateText_t: response.authenticateText,
            visible: true
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userLoggedIn",
        async response => {
          this.setState({ visible: false });
          console.log(response.userInfo);
          await localStorage.setItem("token", response.userInfo.token);
          await SocketHandler.disconnect();
          await SocketHandler.connect(localStorage.getItem("token"));
          setTimeout(() => {
            history.replace("");
            this.props.forceMainBoxRender();
          }, 500);
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "advocateLoggedIn",
        async response => {
          this.setState({ visible: false });
          console.log(response.advocateInfo);
          await localStorage.setItem("token", response.advocateInfo.token);
          await SocketHandler.disconnect();
          await SocketHandler.connect(localStorage.getItem("token"));
          setTimeout(() => {
            history.replace("");
            this.props.forceMainBoxRender();
          }, 500);
        }
      )
    );
    await SocketHandler.emit("translateLogin", {
      language: this.props.language,
      descriptorText: "Please log in below.",
      passwordLabelText: "Password: ",
      loginText: "Log in",
      goBackText: "Go back",
      emailLabelText: "E-mail Address: ",
      requiredFieldText: "this field is required",
      validEmailText: "this email is not valid",
      passwordLengthText: "password must be at least 6 characters long",
      passwordMatchText: "password mismatch",
      authenticateText: "Invalid email or password"
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  handleLogin = e => {
    this.setState({ authenticate: false });
    e.preventDefault();
    SocketHandler.emit("login", {
      email: this.state.email,
      password: this.state.password
    });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleBack = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      history.goBack();
    }, 500);
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Button size="small" onClick={this.handleBack}>
              <KeyboardArrowLeftIcon />
              {this.state.goBackText_t}
            </Button>
          </Grid>
          <Grid item xs={6} />
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
          <Grid item xs={false} md={4} />
          <Grid item xs={12} md={4} style={{ textAlign: "center" }}>
            <Paper>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleLogin}
                onError={errors => console.log(errors)}
              >
                <Grid container>
                  <Grid item xs={1} />
                  <Grid item xs={10}>
                    <TextValidator
                      id="email"
                      name="email"
                      label={this.state.emailLabelText_t}
                      value={this.state.email}
                      onChange={this.handleChange("email")}
                      margin="normal"
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        this.state.requiredFieldText_t,
                        this.state.validEmailText_t
                      ]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1} />
                  <Grid item xs={1} />
                  <Grid item xs={10} style={{ marginBottom: "30px" }}>
                    <TextValidator
                      id="password"
                      name="password"
                      type="password"
                      label={this.state.passwordLabelText_t}
                      value={this.state.password}
                      onChange={this.handleChange("password")}
                      margin="normal"
                      validators={["required"]}
                      errorMessages={[this.state.requiredFieldText_t]}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1} />
                  <Fade
                    in={this.state.invalidLogin}
                    mountOnEnter={true}
                    unmountOnExit={true}
                  >
                    <Grid container>
                      <Grid item xs={1} />
                      <Grid item xs={10} style={{ marginBottom: "30px" }}>
                        <Typography variant="body2" color="error" align="left">
                          {this.state.authenticateText_t}
                        </Typography>
                      </Grid>
                      <Grid item xs={1} />
                    </Grid>
                  </Fade>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      style={{
                        fontStyle: "light",
                        height: "100%"
                      }}
                    >
                      {this.state.loginText_t}
                      <KeyIcon style={{ marginLeft: "5px" }} />
                    </Button>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </Paper>
          </Grid>

          <Grid item xs={false} md={4} />
        </Grid>
      </Fade>
    );
  }
}

export const LoginForm = myConnector(_LoginForm);

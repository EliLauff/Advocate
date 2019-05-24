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

const mapStateToProps = state => {
  return {
    language: localStorage.getItem("language") || state.language,
    userType: localStorage.getItem("userType") || state.userType
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

class _UserSignup extends React.Component {
  state = {
    visible: false,
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: ""
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userAccountCreated",
        async response => {
          console.log(response.createdUser);
          this.setState({ visible: false });
          await localStorage.setItem("token", response.createdUser.token);
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
        "userSignupTranslated",
        response => {
          this.setState({
            ...this.state,
            descriptorText_t: response.returnedDescriptor,
            signupHeaderText_t: response.returnedSignupHeader,
            loginHeaderText_t: response.returnedLoginHeader,
            // firstNameLabelText_t: response.returnedFirstNameLabel,
            // lastNameLabelText_t: response.returnedLastNameLabel,
            passwordLabelText_t: response.returnedPasswordLabel,
            confirmPasswordLabelText_t: response.returnedConfirmPasswordLabel,
            loginText_t: response.returnedLoginText,
            goBackText_t: response.returnedGoBackText,
            createAccountText_t: response.returnedCreateAccountText,
            emailLabelText_t: response.returnedEmailLabelText,
            visible: true
          });
        }
      )
    );
    await SocketHandler.emit("translateUserSignup", {
      language: this.props.language,
      descriptorText:
        "Please use the form below to create an account or log in.",
      signupHeaderText: "Create User Account",
      loginHeaderText: "Already have an account?",
      // firstNameLabelText: "First Name: ",
      // lastNameLabelText: "Last Name: ",
      passwordLabelText: "Password: ",
      confirmPasswordLabelText: "Confirm Password: ",
      loginText: "Log in here",
      goBackText: "Go back",
      createAccountText: "Create Account",
      emailLabelText: "E-mail Address: "
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  handleCreateAccount = e => {
    e.preventDefault();
    console.log("clicked");
    if (
      // this.state.firstName &&
      // this.state.lastName &&
      this.state.email &&
      this.state.password.length > 5 &&
      this.state.password === this.state.confirmPassword
    ) {
      console.log("passed first check");
      SocketHandler.emit("createUserAccount", {
        email: this.state.email,
        // firstName: this.state.firstName,
        // lastName: this.state.lastName,
        password: this.state.password,
        language: this.props.language
      });
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleBack = () => {
    this.setState({ visible: false });
    localStorage.setItem("userType", "");
    this.props.selectUserType("");
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
                      <Grid item xs={10}>
                        <TextField
                          id="email"
                          name="email"
                          label={this.state.emailLabelText_t}
                          value={this.state.email}
                          onChange={this.handleChange("email")}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />
                      {/* <Grid item xs={1} />
                      <Grid item xs={10}>
                        <TextField
                          id="first-name"
                          name="first-name"
                          label={this.state.firstNameLabelText_t}
                          value={this.state.firstName}
                          onChange={this.handleChange("firstName")}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} /> */}

                      {/* <Grid item xs={1} />
                      <Grid item xs={10}>
                        <TextField
                          id="last-name"
                          name="last-name"
                          label={this.state.lastNameLabelText_t}
                          value={this.state.lastName}
                          onChange={this.handleChange("lastName")}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} /> */}
                      <Grid item xs={1} />
                      <Grid item xs={10}>
                        <TextField
                          id="password"
                          name="password"
                          type="password"
                          label={this.state.passwordLabelText_t}
                          value={this.state.password}
                          onChange={this.handleChange("password")}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />
                      <Grid item xs={1} />
                      <Grid item xs={10} style={{ marginBottom: "30px" }}>
                        <TextField
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          label={this.state.confirmPasswordLabelText_t}
                          value={this.state.confirmPassword}
                          onChange={this.handleChange("confirmPassword")}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          style={{
                            fontStyle: "light",
                            height: "100%"
                          }}
                          onClick={this.handleCreateAccount}
                        >
                          {this.state.createAccountText_t}
                          <KeyboardArrowRightIcon />
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} style={{ textAlign: "center" }}>
            <Paper>
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
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      fontStyle: "light",
                      height: "100%"
                    }}
                    onClick={this.requestLogin}
                  >
                    {this.state.loginText_t}
                    <KeyIcon style={{ marginLeft: "5px" }} />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={false} md={2} />
        </Grid>
      </Fade>
    );
  }
}

export const UserSignup = myConnector(_UserSignup);

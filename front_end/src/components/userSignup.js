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
import Divider from "@material-ui/core/Divider";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import history from "../history";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

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
    ValidatorForm.addValidationRule("isPasswordMatch", value => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("isPasswordLong", value => {
      if (value.length < 6) {
        return false;
      }
      return true;
    });

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
            passwordLabelText_t: response.returnedPasswordLabel,
            confirmPasswordLabelText_t: response.returnedConfirmPasswordLabel,
            loginText_t: response.returnedLoginText,
            goBackText_t: response.returnedGoBackText,
            createAccountText_t: response.returnedCreateAccountText,
            emailLabelText_t: response.returnedEmailLabelText,
            requiredFieldText_t: response.requiredFieldText,
            validEmailText_t: response.validEmailText,
            passwordLengthText_t: response.passwordLengthText,
            passwordMatchText_t: response.passwordMatchText,
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
      passwordLabelText: "Password: ",
      confirmPasswordLabelText: "Confirm Password: ",
      loginText: "Log in here",
      goBackText: "Go back",
      createAccountText: "Create Account",
      emailLabelText: "E-mail Address: ",
      requiredFieldText: "this field is required",
      validEmailText: "this email is not valid",
      passwordLengthText: "password must be at least 6 characters long",
      passwordMatchText: "password mismatch"
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
      this.state.email &&
      this.state.password.length > 5 &&
      this.state.password === this.state.confirmPassword
    ) {
      console.log("passed first check");
      SocketHandler.emit("createUserAccount", {
        email: this.state.email,
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
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container spacing={3} >
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
                  <ValidatorForm
                    ref="form"
                    onSubmit={this.handleCreateAccount}
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
                      <Divider />
                      <Grid item xs={1} />
                      <Grid item xs={10}>
                        <TextValidator
                          id="password"
                          name="password"
                          type="password"
                          label={this.state.passwordLabelText_t}
                          value={this.state.password}
                          onChange={this.handleChange("password")}
                          margin="normal"
                          validators={["required", "isPasswordLong"]}
                          errorMessages={[
                            this.state.requiredFieldText_t,
                            this.state.passwordLengthText_t
                          ]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />
                      <Divider />
                      <Grid item xs={1} />
                      <Grid item xs={10} style={{ marginBottom: "30px" }}>
                        <TextValidator
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          label={this.state.confirmPasswordLabelText_t}
                          value={this.state.confirmPassword}
                          onChange={this.handleChange("confirmPassword")}
                          margin="normal"
                          validators={["isPasswordMatch", "required"]}
                          errorMessages={[
                            this.state.passwordMatchText_t,
                            this.state.requiredFieldText_t
                          ]}
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
                        >
                          {this.state.createAccountText_t}
                          <KeyboardArrowRightIcon />
                        </Button>
                      </Grid>
                    </Grid>
                  </ValidatorForm>
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

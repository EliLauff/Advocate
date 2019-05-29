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
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";

const socketIDs = [];

export default class ContactInfo extends React.Component {
  state = {
    visible: false,
    firstName: this.props.accountInfo.accountStuff.first_name,
    lastName: this.props.accountInfo.accountStuff.last_name,
    phone: this.props.accountInfo.accountStuff.phone_number,
    email: this.props.accountInfo.accountStuff.email,
    headerText_t: "",
    firstNameLabelText_t: "",
    lastNameLabelText_t: "",
    goBackText_t: "",
    emailLabelText_t: "",
    phoneLabelText_t: "",
    buttonText_t: ""
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          headerText_t: response.headerText,
          firstNameLabelText_t: response.firstNameLabelText,
          lastNameLabelText_t: response.lastNameLabelText,
          goBackText_t: response.goBackText,
          emailLabelText_t: response.emailLabelText,
          phoneLabelText_t: response.phoneLabelText,
          buttonText_t: response.buttonText,
          requiredFieldText_t: response.requiredFieldText,
          validEmailText_t: response.validEmailText,
          visible: true
        });
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("userUpdated", response => {
        setTimeout(() => {
          history.push("/languages");
        }, 500);
      })
    );
    await SocketHandler.emit("requestAccountInfo");
    await SocketHandler.emit("requestBioInfo", {
      id: parseInt(localStorage.getItem("active_bio"))
    });
    await SocketHandler.emit("translateText", {
      headerText: "Please use the form below to provide your contact info.",
      firstNameLabelText: "First name: ",
      lastNameLabelText: "Last name: ",
      goBackText: "Go back",
      emailLabelText: "E-mail address: ",
      phoneLabelText: "Phone number: ",
      buttonText: "continue",
      requiredFieldText: "this field is required",
      validEmailText: "this email is not valid"
    });
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
    SocketHandler.emit("updateUser", {
      email: this.state.email,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      phone_number: this.state.phone
    });
  };

  renderItems = () => {
    if (this.props.accountInfo) {
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
                <Grid item xs={12} style={{ marginTop: "10px" }}>
                  <ValidatorForm
                    ref="form"
                    onSubmit={this.handleSubmit}
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
                      <Grid item xs={10}>
                        <TextValidator
                          id="first-name"
                          name="first-name"
                          label={this.state.firstNameLabelText_t}
                          value={this.state.firstName}
                          onChange={this.handleChange("firstName")}
                          margin="normal"
                          validators={["required"]}
                          errorMessages={[this.state.requiredFieldText_t]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />

                      <Grid item xs={1} />
                      <Grid item xs={10}>
                        <TextValidator
                          id="last-name"
                          name="last-name"
                          label={this.state.lastNameLabelText_t}
                          value={this.state.lastName}
                          onChange={this.handleChange("lastName")}
                          margin="normal"
                          validators={["required"]}
                          errorMessages={[this.state.requiredFieldText_t]}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />
                      <Grid item xs={1} />
                      <Grid item xs={10}>
                        <TextValidator
                          id="phone"
                          name="phone"
                          type="number"
                          label={this.state.phoneLabelText_t}
                          value={this.state.phone}
                          onChange={this.handleChange("phone")}
                          margin="normal"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={1} />
                      <Grid
                        item
                        xs={12}
                        style={{
                          marginTop: "30px"
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          fullWidth
                          style={{
                            fontStyle: "light",
                            height: "100%"
                          }}
                        >
                          {this.state.buttonText_t}
                          <KeyboardArrowRightIcon />
                        </Button>
                      </Grid>
                    </Grid>
                  </ValidatorForm>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3} />
        </Grid>
      );
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

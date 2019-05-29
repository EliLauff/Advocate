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
import { KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import Divider from "@material-ui/core/Divider";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";

const socketIDs = [];

export default class WorkEntry extends React.Component {
  state = {
    visible: false,
    companyName: "",
    startDate: new Date(),
    finishDate: new Date(),
    positionTitle: "",
    workDescription: "",
    reference: "",
    numSkills: 1,
    skillsLearned: []
  };

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          headerText_t: response.headerText,
          companyNameDescriptorText_t: response.companyNameDescriptorText,
          companyNameLabelText_t: response.companyNameLabelText,
          startDateDescriptorText_t: response.startDateDescriptorText,
          startDateLabelText_t: response.startDateLabelText,
          finishDateDescriptorText_t: response.finishDateDescriptorText,
          finishDateLabelText_t: response.finishDateLabelText,
          positionTitleDescriptorText_t: response.positionTitleDescriptorText,
          positionTitleLabelText_t: response.positionTitleLabelText,
          referenceDescriptorText_t: response.referenceDescriptorText,
          referenceLabelText_t: response.referenceLabelText,
          workDescriptorText_t: response.workDescriptorText,
          workLabelText_t: response.workLabelText,
          skillsLearnedDescriptorText_t: response.skillsLearnedDescriptorText,
          skillsLearnedLabelText_t: response.skillsLearnedLabelText,
          skillButtonText_t: response.skillButtonText,
          submitButtonText_t: response.submitButtonText,
          requiredErrorText_t: response.requiredErrorText,
          visible: true
        });
      })
    );
    await SocketHandler.emit("requestAccountInfo");
    await SocketHandler.emit("translateText", {
      headerText: "Please use the form below to describe your most recent job.",
      companyNameDescriptorText:
        "What is the name of the company that you worked for?",
      companyNameLabelText: "Company name: ",
      startDateDescriptorText: "On what date did you start working this job?",
      startDateLabelText: "Start date: ",
      finishDateDescriptorText: "On what date did you finish working this job?",
      finishDateLabelText: "Finish date: ",
      positionTitleDescriptorText:
        "What job title did you have? (For example: 'accountant' or 'seamstress')",
      positionTitleLabelText: "Position title: ",
      referenceDescriptorText:
        "Please provide a reference (a contact phone number or email for your manager at this job).",
      referenceLabelText: "Manager contact info: ",
      workDescriptorText:
        "Please describe the work that you were responsible for.",
      workLabelText: "Work Description: ",
      skillsLearnedDescriptorText:
        "Please list each skill that you learned while doing this work (For example: 'javascript', 'leadership', 'time management', 'operation of heavy equipment'). Please place only one skill on each line and press the button below to add more lines as needed.",
      skillsLearnedLabelText: "Skill Learned: ",
      skillButtonText: "Add another skill",
      submitButtonText: "Continue",
      requiredErrorText: "This field is required"
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

  handleStartDateChange = date => {
    this.setState({ startDate: date });
  };

  handleFinishDateChange = date => {
    this.setState({ finishDate: date });
  };

  incrementNumSkills = () => {
    console.log("in here");
    this.setState({
      numSkills: this.state.numSkills + 1
    });
    this.forceUpdate();
  };

  renderSkillBoxes = () => {
    let boxes = [];
    for (let i = 0; i < this.state.numSkills; i++) {
      console.log("rendering box");
      boxes.push(
        <TextField
          id={`skill-${i}`}
          name={`skill-${i}`}
          label={this.state.skillsLearnedLabelText_t}
          value={this.state[`skill-${i}`]}
          onChange={this.handleChange(`skill-${i}`)}
          margin="normal"
          fullWidth
        />
      );
    }
    return boxes;
  };

  handleSubmit = e => {
    this.setState({ visible: false });
    setTimeout(() => {
      history.push("/workQuestion");
    }, 500);
  };

  render() {
    console.log("rendering", this.state.numSkills);
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container>
          {" "}
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
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "30px" }}
                          >
                            {this.state.companyNameDescriptorText_t}
                          </Typography>
                          <TextField
                            id="companyName"
                            name="companyName"
                            label={this.state.companyNameLabelText_t}
                            value={this.state.companyName}
                            onChange={this.handleChange("companyName")}
                            margin="normal"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px" }}
                          >
                            {this.state.positionTitleDescriptorText_t}
                          </Typography>
                          <TextValidator
                            id="positionTitle"
                            name="positionTitle"
                            label={this.state.positionTitleLabelText_t}
                            value={this.state.positionTitle}
                            onChange={this.handleChange("positionTitle")}
                            margin="normal"
                            validators={["required"]}
                            errorMessages={[this.state.requiredErrorText_t]}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px" }}
                          >
                            {this.state.startDateDescriptorText_t}
                          </Typography>
                          <KeyboardDatePicker
                            id="startDate"
                            name="startDate"
                            margin="normal"
                            openTo="year"
                            views={["year", "month"]}
                            label={this.state.startDateLabelText_t}
                            value={this.state.startDate}
                            onChange={this.handleStartDateChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px" }}
                          >
                            {this.state.finishDateDescriptorText_t}
                          </Typography>
                          <KeyboardDatePicker
                            id="finishDate"
                            name="finishDate"
                            margin="normal"
                            openTo="year"
                            views={["year", "month"]}
                            label={this.state.finishDateLabelText_t}
                            value={this.state.finishDate}
                            onChange={this.handleFinishDateChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px" }}
                          >
                            {this.state.referenceDescriptorText_t}
                          </Typography>
                          <TextField
                            id="reference"
                            name="reference"
                            label={this.state.referenceLabelText_t}
                            value={this.state.reference}
                            onChange={this.handleChange("reference")}
                            margin="normal"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px" }}
                          >
                            {this.state.workDescriptorText_t}
                          </Typography>
                          <TextValidator
                            id="workDescription"
                            name="workDescription"
                            label={this.state.workLabelText_t}
                            value={this.state.workDescription}
                            onChange={this.handleChange("workDescription")}
                            margin="normal"
                            validators={["required"]}
                            errorMessages={[this.state.requiredErrorText_t]}
                            fullWidth
                            multiline={true}
                          />
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px", marginBottom: "25px" }}
                          >
                            {this.state.skillsLearnedDescriptorText_t}
                          </Typography>
                          <Grid container>
                            <Grid item xs={7}>
                              {this.renderSkillBoxes()}
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
                                onClick={this.incrementNumSkills}
                                fullWidth
                              >
                                {this.state.skillButtonText_t}
                              </Button>
                            </Grid>
                          </Grid>
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
                            {this.state.submitButtonText_t}
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
        </Grid>
      </Fade>
    );
  }
}

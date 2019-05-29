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
import { KeyboardDatePicker } from "@material-ui/pickers";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator
} from "react-material-ui-form-validator";

const socketIDs = [];

export default class EduEntry extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      visible: false,
      schoolName: "",
      startDate: new Date(),
      finishDate: new Date(),
      degreeType: "",
      degreeMajor: ""
    };
  }

  async componentDidMount() {
    socketIDs.push(
      await SocketHandler.registerSocketListener("eduEntrySaved", () => {
        setTimeout(() => {
          history.push("/eduQuestion");
        }, 500);
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          headerText_t: response.headerText,
          schoolNameDescriptorText_t: response.schoolNameDescriptorText,
          schoolNameLabelText_t: response.schoolNameLabelText,
          startDateDescriptorText_t: response.startDateDescriptorText,
          startDateLabelText_t: response.startDateLabelText,
          finishDateDescriptorText_t: response.finishDateDescriptorText,
          finishDateLabelText_t: response.finishDateLabelText,
          degreeTypeDescriptorText_t: response.degreeTypeDescriptorText,
          degreeTypeLabelText_t: response.degreeTypeLabelText,
          degreeMajorDescriptorText_t: response.degreeMajorDescriptorText,
          degreeMajorLabelText_t: response.degreeMajorLabelText,
          submitButtonText_t: response.submitButtonText,
          requiredErrorText_t: response.requiredErrorText,
          highSchoolText_t: response.highSchoolText,
          associateDegreeText_t: response.associateDegreeText,
          bachelorDegreeText_t: response.bachelorDegreeText,
          masterDegreeText_t: response.masterDegreeText,
          doctoralDegreeText_t: response.doctoralDegreeText,
          otherDegreeText_t: response.otherDegreeText,
          noneText_t: response.noneText,
          selectText_t: response.selectText,
          schoolName: this.props.bioInfo.eduEntries.find(
            entry => entry.id === parseInt(localStorage.getItem("eduEntry_id"))
          ).school_name,
          startDate:
            this.props.bioInfo.eduEntries.find(
              entry =>
                entry.id === parseInt(localStorage.getItem("eduEntry_id"))
            ).start_date || new Date(),
          finishDate:
            this.props.bioInfo.eduEntries.find(
              entry =>
                entry.id === parseInt(localStorage.getItem("eduEntry_id"))
            ).finish_date || new Date(),
          degreeType: this.props.bioInfo.eduEntries.find(
            entry => entry.id === parseInt(localStorage.getItem("eduEntry_id"))
          ).degree_type,
          degreeMajor: this.props.bioInfo.eduEntries.find(
            entry => entry.id === parseInt(localStorage.getItem("eduEntry_id"))
          ).degree_major,
          visible: true,
          id: parseInt(localStorage.getItem("eduEntry_id"))
        });
      })
    );
    await SocketHandler.emit("requestAccountInfo");
    await SocketHandler.emit("requestBioInfo", {
      id: parseInt(localStorage.getItem("active_bio"))
    });
    await SocketHandler.emit("translateText", {
      headerText:
        "Please use the form below to describe your educational background.",
      schoolNameDescriptorText:
        "What is the name of the school that you attended?",
      schoolNameLabelText: "School name: ",
      startDateDescriptorText:
        "On what date did you start attending this school?",
      startDateLabelText: "Start date: ",
      finishDateDescriptorText:
        "On what date did you finish attending this school?",
      finishDateLabelText: "Finish date: ",
      degreeTypeDescriptorText: "What type of degree did you earn?",
      degreeTypeLabelText: "Degree type: ",
      degreeMajorDescriptorText:
        "What was your area of study or educational focus? (Please leave empty if not applicable)",
      degreeMajorLabelText: "Area of study: ",
      submitButtonText: "Continue",
      requiredErrorText: "This field is required",
      highSchoolText: "High School Diploma",
      associateDegreeText: "Associate Degree",
      bachelorDegreeText: "Bachelor's Degree",
      masterDegreeText: "Master's Degree",
      doctoralDegreeText: "Doctoral Degree",
      otherDegreeText: "Other",
      noneText: "None",
      selectText: "Select an option..."
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

  handleSubmit = e => {
    this.setState({ visible: false });
    SocketHandler.emit("saveEduEntry", {
      id: this.state.id,
      schoolName: this.state.schoolName,
      startDate: this.state.startDate,
      finishDate: this.state.finishDate,
      degreeType: this.state.degreeType,
      degreeMajor: this.state.degreeMajor
    });
  };

  degreeOptions = () => {
    const options = [
      {
        key: "High School Diploma",
        text: this.state.highSchoolText_t,
        value: "High School Diploma"
      },
      {
        key: "Associate Degree",
        text: this.state.associateDegreeText_t,
        value: "Associate Degree"
      },
      {
        key: "Bachelor's Degree",
        text: this.state.bachelorDegreeText_t,
        value: "Bachelor's Degree"
      },
      {
        key: "Master's Degree",
        text: this.state.masterDegreeText_t,
        value: "Master's Degree"
      },
      {
        key: "Doctoral Degree",
        text: this.state.doctoralDegreeText_t,
        value: "Doctoral Degree"
      },
      {
        key: "Other",
        text: this.state.otherDegreeText_t,
        value: "Other"
      }
    ];

    return (
      <div>
        <Hidden smDown>
          <FormControl style={{ minWidth: "240px" }} fullWidth>
            <SelectValidator
              autoWidth
              label={this.state.selectText_t}
              value={this.state.degreeType}
              onChange={this.handleChange("degreeType")}
              validators={["required"]}
              errorMessages={[this.state.requiredErrorText_t]}
            >
              <MenuItem value="">
                <em>{this.state.noneText_t}</em>
              </MenuItem>
              {options.map(option => {
                return <MenuItem value={option.value}>{option.text}</MenuItem>;
              })}
            </SelectValidator>
          </FormControl>
        </Hidden>

        <Hidden mdUp>
          <FormControl style={{ minWidth: "240px" }} fullWidth>
            <SelectValidator
              native
              label={this.state.selectText_t}
              value={this.state.degreeType}
              onChange={this.handleChange("degreeType")}
              validators={["required"]}
              errorMessages={[this.state.requiredErrorText_t]}
            >
              <option value="">{this.state.noneText_t}</option>
              {options.map(option => {
                return <option value={option.value}>{option.text}</option>;
              })}
            </SelectValidator>
          </FormControl>
        </Hidden>
      </div>
    );
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container>
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
                            {this.state.schoolNameDescriptorText_t}
                          </Typography>
                          <TextValidator
                            id="schoolName"
                            name="schoolName"
                            label={this.state.schoolNameLabelText_t}
                            value={this.state.schoolName}
                            onChange={this.handleChange("schoolName")}
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
                            {this.state.degreeTypeDescriptorText_t}
                          </Typography>
                          {this.degreeOptions()}
                        </Grid>
                        <Grid item xs={1} />
                        <Divider />
                        <Grid item xs={1} />
                        <Grid item xs={10}>
                          <Typography
                            variant={"body1"}
                            style={{ marginTop: "60px" }}
                          >
                            {this.state.degreeMajorDescriptorText_t}
                          </Typography>
                          <TextField
                            id="degreeMajor"
                            name="degreeMajor"
                            label={this.state.degreeMajorLabelText_t}
                            value={this.state.degreeMajor}
                            onChange={this.handleChange("degreeMajor")}
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

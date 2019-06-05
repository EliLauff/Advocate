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

export default class Languages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      numLangs:
        this.props.accountInfo.accountLangs.length > 0
          ? this.props.accountInfo.accountLangs.length
          : 1,
      languages: [],
      lang_0: {
        name: "",
        speaking: "",
        writing: ""
      }
    };
    if (this.props.accountInfo.accountLangs.length > 0) {
      let n = 0;
      while (n < this.state.numLangs) {
        this.state = {
          ...this.state,
          [`lang_${n}`]: {
            name: this.props.accountInfo.accountLangs[n].name,
            speaking: this.props.accountInfo.accountLangs[n].speaking_score,
            writing: this.props.accountInfo.accountLangs[n].writing_score
          }
        };
        n++;
      }
    }
  }

  async componentDidMount() {
    ValidatorForm.addValidationRule("minimumOneLanguage", value => {
      if (this.state.lang_0.name === "") {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("mustHaveSpeakingScore", value => {
      if (this.state.lang_0.speaking === "") {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("mustHaveWritingScore", value => {
      if (this.state.lang_0.writing === "") {
        return false;
      }
      return true;
    });

    socketIDs.push(
      await SocketHandler.registerSocketListener("textTranslated", response => {
        console.log(response);
        this.setState({
          ...this.state,
          headerText_t: response.headerText,
          languagesDescriptorText_t: response.languagesDescriptorText,
          languagesLabelText_t: response.languagesLabelText,
          langButtonText_t: response.langButtonText,
          submitButtonText_t: response.submitButtonText,
          speakingProficiencyLabelText_t: response.speakingProficiencyLabelText,
          readingWritingProficiencyLabelText_t:
            response.readingWritingProficiencyLabelText,
          requiredErrorText_t: response.requiredErrorText,
          minimumLanguageText_t: response.minimumLanguageText,
          noneText_t: response.noneText,
          visible: true
        });
      })
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener("languagesAdded", () => {
        setTimeout(() => {
          history.push("/certifications");
        }, 500);
      })
    );

    await SocketHandler.emit("requestAccountInfo");
    await SocketHandler.emit("translateText", {
      headerText:
        "Please use the form below to record any languages you understand.",
      languagesDescriptorText:
        "Please list any and each language you understand (minimum of one). Please place only one language on each line and press the button below to add more lines as needed.  Please rank your speaking proficiency and your reading/writing proficiency on a scale of 1 to 5 (1 means beginner, 5 means fluent)",
      languagesLabelText: "Language: ",
      langButtonText: "Add another language",
      speakingProficiencyLabelText: "Speaking: ",
      readingWritingProficiencyLabelText: "Writing: ",
      submitButtonText: "Continue",
      requiredErrorText: "This field is required",
      minimumLanguageText: "One language is required",
      noneText: "None"
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  handleChange = (lang, attribute) => event => {
    this.setState({
      ...this.state,
      [lang]: {
        ...this.state[lang],
        [attribute]: event.target.value
      }
    });
  };

  handleSubmit = e => {
    console.log("submitted");
    this.setState({ visible: false });
    console.log(this.state);
    let languageData = [];
    for (let keyText in this.state) {
      if (keyText.includes("lang_")) {
        languageData.push(this.state[keyText]);
      }
    }
    console.log(languageData);
    SocketHandler.emit("addLanguages", {
      languageData: languageData
    });
  };

  handleStartDateChange = date => {
    this.setState({ startDate: date });
  };

  handleFinishDateChange = date => {
    this.setState({ finishDate: date });
  };

  incrementNumLangs = () => {
    this.setState({
      ...this.state,
      numLangs: this.state.numLangs + 1,
      [`lang_${this.state.numLangs}`]: {
        name: "",
        speaking: "",
        writing: ""
      }
    });
    this.forceUpdate();
  };

  renderLangBoxes = () => {
    console.log(this.state);
    const options = [
      {
        key: "1",
        text: "1",
        value: "1"
      },
      {
        key: "2",
        text: "2",
        value: "2"
      },
      {
        key: "3",
        text: "3",
        value: "3"
      },
      {
        key: "4",
        text: "4",
        value: "4"
      },
      {
        key: "5",
        text: "5",
        value: "5"
      }
    ];
    let boxes = [];
    for (let i = 0; i < this.state.numLangs; i++) {
      console.log("rendering box");
      boxes.push(
        <Grid container>
          <TextValidator
            label={this.state.languagesLabelText_t}
            value={this.state[`lang_${i}`]["name"]}
            onChange={this.handleChange(`lang_${i}`, "name")}
            margin="normal"
            validators={["minimumOneLanguage"]}
            errorMessages={[this.state.minimumLanguageText_t]}
            fullWidth
          />
          <Hidden smDown>
            <FormControl fullWidth>
              <SelectValidator
                label={this.state.speakingProficiencyLabelText_t}
                value={this.state[`lang_${i}`]["speaking"]}
                onChange={this.handleChange(`lang_${i}`, "speaking")}
                validators={["mustHaveSpeakingScore"]}
                errorMessages={[this.state.requiredErrorText_t]}
              >
                <MenuItem value="">
                  <em>{this.state.noneText_t}</em>
                </MenuItem>
                {options.map(option => {
                  return (
                    <MenuItem value={option.value}>{option.text}</MenuItem>
                  );
                })}
              </SelectValidator>
            </FormControl>
          </Hidden>

          <Hidden mdUp>
            <FormControl fullWidth>
              <InputLabel>{this.state.speakingProficiencyLabelText_t}</InputLabel>
              <Select
                native={true}
                value={this.state[`lang_${i}`]["speaking"]}
                onChange={this.handleChange(`lang_${i}`, "speaking")}
              >
                <option value=""></option>
                {options.map(option => {
                  return <option value={option.value}>{option.text}</option>;
                })}
              </Select>
            </FormControl>
          </Hidden>
          <Hidden smDown>
            <FormControl fullWidth>
              <SelectValidator
                label={this.state.readingWritingProficiencyLabelText_t}
                value={this.state[`lang_${i}`]["writing"]}
                onChange={this.handleChange(`lang_${i}`, "writing")}
                validators={["mustHaveWritingScore"]}
                errorMessages={[this.state.requiredErrorText_t]}
              >
                <MenuItem value="">
                  <em>{this.state.noneText_t}</em>
                </MenuItem>
                {options.map(option => {
                  return (
                    <MenuItem value={option.value}>{option.text}</MenuItem>
                  );
                })}
              </SelectValidator>
            </FormControl>
          </Hidden>

          <Hidden mdUp>
            <FormControl fullWidth>
              <InputLabel>{this.state.readingWritingProficiencyLabelText_t}</InputLabel>
              <Select
                native
                value={this.state[`lang_${i}`]["writing"]}
                onChange={this.handleChange(`lang_${i}`, "writing")}
              >
                <option value=""></option>
                {options.map(option => {
                  return <option value={option.value}>{option.text}</option>;
                })}
              </Select>
            </FormControl>
          </Hidden>
        </Grid>
      );
    }
    return boxes;
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
                            style={{ marginTop: "30px", marginBottom: "25px" }}
                          >
                            {this.state.languagesDescriptorText_t}
                          </Typography>
                          <Grid container>
                            <Grid item xs={7}>
                              {this.renderLangBoxes()}
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
                                onClick={this.incrementNumLangs}
                                fullWidth
                              >
                                {this.state.langButtonText_t}
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

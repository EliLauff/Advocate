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

const socketIDs = [];

export default class NewUser extends React.Component {
  state = {
    visible: false,
    headerText_t: "",
    descriptorText_t: "",
    buttonText_t: "",
    firstName: "",
    lastName: "",
    selectedLanguage: ""
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
          firstNameLabelText_t: response.firstNameLabelText,
          lastNameLabelText_t: response.lastNameLabelText,
          noneText_t: response.noneText,
          selectText_t: response.selectText,
          visible: true
        });
      })
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "resumeRequesteeCreated",
        response => {
          localStorage.setItem("userLink", response.createdRequestee.token);
          setTimeout(() => {
            history.push("/userLink");
          }, 500);
        }
      )
    );
    await SocketHandler.emit("translateText", {
      headerText:
        "Please input accurate information for your resume requestee.",
      descriptorText:
        "On this page, you can input information for your new user so that they don't have to.  If you aren't certain, feel free to leave these fields blank.",
      buttonText: "Submit",
      firstNameLabelText: "First Name: ",
      lastNameLabelText: "Last Name: ",
      noneText: "None",
      selectText: "Select a language..."
    });

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
    console.log("submitting", this.state);
    this.setState({ visible: false });
    SocketHandler.emit("createResumeRequestee", {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      selectedLanguage: this.state.selectedLanguage
    });
  };

  languageOptions = () => {
    const languages = [
      { key: "af", text: "Afrikaans", value: "af" },
      { key: "sq", text: "Albanian", value: "sq" },
      { key: "am", text: "Amharic", value: "am" },
      { key: "ar", text: "Arabic", value: "ar" },
      { key: "hy", text: "Armenian", value: "hy" },
      { key: "az", text: "Azeerbaijani", value: "az" },
      { key: "eu", text: "Basque", value: "eu" },
      { key: "bn", text: "Bengali", value: "bn" },
      { key: "bs", text: "Bosnian", value: "bs" },
      { key: "bg", text: "Bulgarian", value: "bg" },
      { key: "ca", text: "Catalan", value: "ca" },
      { key: "zh-CN", text: "Chinese (Simplified)", value: "zh-CN" },
      { key: "zh-TW", text: "Chinese (Traditional)", value: "zh-TW" },
      { key: "co", text: "Corsican", value: "co" },
      { key: "hr", text: "Croatian", value: "hr" },
      { key: "cs", text: "Czech", value: "cs" },
      { key: "da", text: "Danish", value: "da" },
      { key: "nl", text: "Dutch", value: "nl" },
      { key: "en", text: "English", value: "en" },
      { key: "eo", text: "Esperanto", value: "eo" },
      { key: "et", text: "Estonian", value: "et" },
      { key: "fi", text: "Finnish", value: "fi" },
      { key: "fr", text: "French", value: "fr" },
      { key: "fy", text: "Frisian", value: "fy" },
      { key: "gl", text: "Galician", value: "gl" },
      { key: "ka", text: "Georgian", value: "ka" },
      { key: "de", text: "German", value: "de" },
      { key: "el", text: "Greek", value: "el" },
      { key: "gu", text: "Gujarati", value: "gu" },
      { key: "ht", text: "Haitian Creole", value: "ht" },
      { key: "ha", text: "Hausa", value: "ha" },
      { key: "he", text: "Hebrew", value: "he" },
      { key: "hi", text: "Hindi", value: "hi" },
      { key: "hu", text: "Hungarian", value: "hu" },
      { key: "is", text: "Icelandic", value: "is" },
      { key: "ig", text: "Igbo", value: "ig" },
      { key: "id", text: "Indonesian", value: "id" },
      { key: "ga", text: "Irish", value: "ga" },
      { key: "it", text: "Italian", value: "it" },
      { key: "ja", text: "Japanese", value: "ja" },
      { key: "jw", text: "Javanese", value: "jw" },
      { key: "kn", text: "Kannada", value: "kn" },
      { key: "kk", text: "Kazakh", value: "kk" },
      { key: "km", text: "Khmer", value: "km" },
      { key: "ko", text: "Korean", value: "ko" },
      { key: "ku", text: "Kurdish", value: "ku" },
      { key: "lo", text: "Lao", value: "lo" },
      { key: "lv", text: "Latvian", value: "lv" },
      { key: "lt", text: "Lithuanian", value: "lt" },
      { key: "lb", text: "Luxembourgish", value: "lb" },
      { key: "mk", text: "Macedonian", value: "mk" },
      { key: "mg", text: "Malagasy", value: "mg" },
      { key: "ms", text: "Malay", value: "ms" },
      { key: "ml", text: "Malayalam", value: "ml" },
      { key: "mi", text: "Maori", value: "mi" },
      { key: "mr", text: "Marathi", value: "mr" },
      { key: "mn", text: "Mongolian", value: "mn" },
      { key: "my", text: "Myanmar (Burmese)", value: "my" },
      { key: "ne", text: "Nepali", value: "ne" },
      { key: "no", text: "Norwegian", value: "no" },
      { key: "ny", text: "Nyanja (Chichewa)", value: "ny" },
      { key: "ps", text: "Pashto", value: "ps" },
      { key: "fa", text: "Persian (Farsi)", value: "fa" },
      { key: "pl", text: "Polish", value: "pl" },
      { key: "pt", text: "Portuguese (Portugal, Brazil)", value: "pt" },
      { key: "pa", text: "Punjabi", value: "pa" },
      { key: "ro", text: "Romanian", value: "ro" },
      { key: "ru", text: "Russian", value: "ru" },
      { key: "sm", text: "Samoan", value: "sm" },
      { key: "gd", text: "Scots Gaelic", value: "gd" },
      { key: "sr", text: "Serbian", value: "sr" },
      { key: "st", text: "Sesotho", value: "st" },
      { key: "sn", text: "Shona", value: "sn" },
      { key: "sd", text: "Sindhi", value: "sd" },
      { key: "si", text: "Sinhala (Sinhalese)", value: "si" },
      { key: "sk", text: "Slovak", value: "sk" },
      { key: "sl", text: "Slovenian", value: "sl" },
      { key: "so", text: "Somali", value: "so" },
      { key: "es", text: "Spanish", value: "es" },
      { key: "sw", text: "Swahili", value: "sw" },
      { key: "sv", text: "Swedish", value: "sv" },
      { key: "tl", text: "Tagalog (Filipino)", value: "tl" },
      { key: "tg", text: "Tajik", value: "tg" },
      { key: "ta", text: "Tamil", value: "ta" },
      { key: "te", text: "Telugu", value: "te" },
      { key: "th", text: "Thai", value: "th" },
      { key: "tr", text: "Turkish", value: "tr" },
      { key: "uk", text: "Ukrainian", value: "uk" },
      { key: "ur", text: "Urdu", value: "ur" },
      { key: "uz", text: "Uzbek", value: "uz" },
      { key: "vi", text: "Vietnamese", value: "vi" },
      { key: "cy", text: "Welsh", value: "cy" },
      { key: "xh", text: "Xhosa", value: "xh" },
      { key: "yi", text: "Yiddish", value: "yi" },
      { key: "yo", text: "Yoruba", value: "yo" },
      { key: "zu", text: "Zulu", value: "zu" }
    ];

    return (
      <div style={{ textAlign: "left" }}>
        <Hidden smDown>
          <FormControl style={{ minWidth: "240px" }} fullWidth>
            <InputLabel>Select a language...</InputLabel>
            <Select
              fullWidth
              value={this.state.selectedLanguage}
              onChange={this.handleChange("selectedLanguage")}
            >
              <MenuItem value="">
                <em>{this.state.noneText_t}</em>
              </MenuItem>
              {languages.map(language => {
                return (
                  <MenuItem value={language.value}>{language.text}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Hidden>

        <Hidden mdUp>
          <FormControl style={{ minWidth: "240px" }} fullWidth>
            <InputLabel>{this.state.selectText_t}</InputLabel>
            <Select
              native
              fullWidth
              value={this.state.selectedLanguage}
              onChange={this.handleChange("selectedLanguage")}
            >
              <option value="" />
              {languages.map(language => {
                return <option value={language.value}>{language.text}</option>;
              })}
            </Select>
          </FormControl>
        </Hidden>
      </div>
    );
  };

  renderItems = () => {
    if (this.props.accountInfo) {
      if (this.props.accountInfo.accountStuff.account_type === "advocate") {
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
                <form>
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
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        id="firstName"
                        name="firstName"
                        label={this.state.firstNameLabelText_t}
                        value={this.state.firstName}
                        onChange={this.handleChange("firstName")}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={1} />
                    <Grid
                      item
                      xs={10}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <TextField
                        id="lastName"
                        name="lastName"
                        label={this.state.lastNameLabelText_t}
                        value={this.state.lastName}
                        onChange={this.handleChange("lastName")}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={1} />
                    <Grid
                      item
                      xs={10}
                      style={{ marginTop: "20px", marginBottom: "50px" }}
                    >
                      {this.languageOptions()}
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
                </form>
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
        <Grid container>{this.renderItems()}</Grid>
      </Fade>
    );
  }
}

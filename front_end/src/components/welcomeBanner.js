import React from "react";
import SocketHandler from "../SocketHandler";
import { connect } from "react-redux";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Hidden from "@material-ui/core/Hidden";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import KeyIcon from "@material-ui/icons/VpnKey";
import history from "../history";

const mapDispatchToProps = dispatch => {
  return {
    setLanguage: language =>
      dispatch({ type: "SET_LANGUAGE", payload: { language: language } })
  };
};

const myConnector = connect(
  null,
  mapDispatchToProps
);

let timeouts = [];
let socketID = null;

class _WelcomeBanner extends React.Component {
  state = {
    visible: true,
    allVisible: false,
    language: "en",
    headerText: "Welcome to Advocate.",
    descriptorText:
      "This is a resume building tool designed for non native english speakers.",
    bodyText: "Please select a language from the choices below.",
    selectedLanguage: ""
  };

  async componentDidMount() {
    socketID = await SocketHandler.registerSocketListener(
      "bannerTranslated",
      response => {
        this.setState({
          ...this.state,
          headerText: response.returnedHeader,
          descriptorText: response.returnedDescriptor,
          bodyText: response.returnedBody,
          visible: true
        });

        timeouts.push(
          window.setTimeout(() => this.transitionOut(this.state.language), 4000)
        );
      }
    );

    timeouts.push(
      window.setTimeout(() => this.transitionOut(this.state.language), 4000)
    );

    this.setState({ allVisible: true });
  }

  componentWillUnmount() {
    for (let i = 0; i < timeouts.length; i++) {
      window.clearTimeout(timeouts[i]);
    }
    console.log(timeouts);
    SocketHandler.unregisterSocketListener(socketID);
    timeouts = [];
  }

  transitionIn = () => {
    SocketHandler.emit("welcomeBannerTranslate", {
      headerText: "Welcome to Advocate.",
      descriptorText:
        "This is a resume building tool designed for non native english speakers.",
      bodyText: "Please select a language from the choices below.",
      language: this.state.language
    });
  };

  transitionOut = currentLanguage => {
    const languages = [
      "en",
      "es",
      "ar",
      "ne",
      "sw",
      "fr",
      "so",
      "my",
      "zh-CN",
      "tl",
      "ht",
      "vi",
      "ur",
      "ko",
      "fa",
      "hy",
      "hi"
    ];
    const index =
      languages.indexOf(currentLanguage) >= languages.length - 1
        ? 0
        : languages.indexOf(currentLanguage) + 1;
    const newLanguage = languages[index];
    this.setState({ ...this.state, visible: false, language: newLanguage });
    timeouts.push(window.setTimeout(this.transitionIn, 1000));
  };

  handleChange = name => event => {
    this.setState({ ...this.state, [name]: event.target.value });
  };

  requestLogin = () => {
    this.setState({ ...this.state, allVisible: false });
    window.setTimeout(() => {
      history.push("/loginForm");
    }, 500);
  };

  handleClick = e => {
    if (this.state.selectedLanguage !== "") {
      this.setState({ ...this.state, allVisible: false });
      this.props.setLanguage(this.state.selectedLanguage);
      localStorage.setItem("language", this.state.selectedLanguage);
      window.setTimeout(() => {
        history.push("/userSelect");
      }, 500);
    }
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
      <div style={{ textAlign: "center" }}>
        <Hidden smDown>
          <FormControl style={{ minWidth: "240px" }}>
            <InputLabel>Select a language...</InputLabel>
            <Select
              autoWidth
              value={this.state.selectedLanguage}
              onChange={this.handleChange("selectedLanguage")}
            >
              <MenuItem value="">
                <em>None</em>
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
          <FormControl style={{ minWidth: "240px" }}>
            <InputLabel>Select a language...</InputLabel>
            <Select
              native
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

  render() {
    return (
      <Fade in={this.state.allVisible} timeout={500} unmountOnExit={true}>
        <Grid container spacing={3} >
          <Grid item xs={6} />
          <Grid item xs={6} style={{ textAlign: "right" }}>
            <Button size="small" onClick={this.requestLogin}>
              Log in
              <KeyIcon style={{ marginLeft: "5px" }} />
            </Button>
          </Grid>
          <Grid item xs={12} />
          <Grid item xs={12} />
          <Hidden smDown>
            <Grid item xs={12} />
            <Grid item xs={12} />
          </Hidden>
          <Grid item xs={1} md={2} />
          <Grid item xs={10} md={8} style={{ minHeight: "245px" }}>
            <Fade in={this.state.visible} timeout={500}>
              <div style={{ textAlign: "center" }}>
                <Typography
                  variant="h1"
                  style={{ fontFamily: "comfortaa", fontStyle: "" }}
                  gutterBottom
                >
                  {this.state.headerText}
                </Typography>
                <Typography
                  variant="h3"
                  style={{ fontFamily: "comfortaa", fontStyle: "light" }}
                  gutterBottom
                >
                  {this.state.descriptorText}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontFamily: "Open Sans", fontStyle: "light" }}
                  gutterBottom
                >
                  {this.state.bodyText}
                </Typography>
              </div>
            </Fade>
          </Grid>
          <Grid item xs={1} md={2} />
          <Grid item xs={1} md={2} />
          <Grid item xs={10} md={8}>
            {this.languageOptions()}
          </Grid>
          <Grid item xs={1} md={2} />

          <Grid item xs={1} md={2} />
          <Fade in={this.state.selectedLanguage ? true : false} timeout={750}>
            <Grid item xs={10} md={8} style={{ textAlign: "center" }}>
              <Button
                variant="contained"
                style={{ minWidth: "240px" }}
                onClick={this.handleClick}
              >
                Continue
              </Button>
            </Grid>
          </Fade>
          <Grid item xs={1} md={2} />
        </Grid>
      </Fade>
    );
  }
}

export const WelcomeBanner = myConnector(_WelcomeBanner);

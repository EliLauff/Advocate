import React from "react";
import { Grid, Transition, Dropdown, Button, Icon } from "semantic-ui-react";
import SocketHandler from "../SocketHandler";
import { connect } from "react-redux";

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

class _WelcomeBanner extends React.Component {
  state = {
    visible: true,
    allVisible: false,
    language: "en",
    headerText: "Welcome to Advocate.",
    descriptorText:
      "This is a resume building app designed for non native english speakers.",
    bodyText: "Please select a language from the choices below.",
    selectedLanguage: ""
  };

  componentDidMount() {
    SocketHandler.registerSocketListener("bannerTranslated", response => {
      this.setState({
        ...this.state,
        headerText: response.returnedHeader,
        descriptorText: response.returnedDescriptor,
        bodyText: response.returnedBody,
        visible: true
      });
      setTimeout(() => this.transitionOut(this.state.language), 4000);
    });

    setTimeout(() => this.transitionOut(this.state.language), 4000);

    this.setState({ allVisible: true });
  }

  transitionIn = () => {
    SocketHandler.emit("welcomeBannerTranslate", {
      headerText: "Welcome to Advocate.",
      descriptorText:
        "This is a resume building app designed for non native english speakers.",
      bodyText: "Please select a language from the choices below.",
      language: this.state.language
    });
  };

  transitionOut = currentLanguage => {
    const languages = ["en", "es", "fa", "sw", "ur", "my", "fr", "ar", "zh-CN"];
    const index =
      languages.indexOf(currentLanguage) >= languages.length - 1
        ? 0
        : languages.indexOf(currentLanguage) + 1;
    const newLanguage = languages[index];
    this.setState({ ...this.state, visible: false, language: newLanguage });
    setTimeout(this.transitionIn, 1000);
  };

  handleChange = (e, { value }) => {
    this.setState({ ...this.state, selectedLanguage: value });
  };

  handleClick = e => {
    if (this.state.selectedLanguage !== "") {
      this.setState({ ...this.state, allVisible: false });
      this.props.setLanguage(this.state.selectedLanguage);
      setTimeout(() => {
        localStorage.setItem("language", this.state.selectedLanguage);
        this.props.forceMainBoxRender();
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
      <div>
        <Dropdown
          placeholder="Choose language..."
          fluid
          search
          selection
          attached
          options={languages}
          onChange={this.handleChange}
        />
        <Button onClick={this.handleClick} attached="bottom">
          Continue
          <Icon name="right arrow" />
        </Button>
      </div>
    );
  };

  render() {
    return (
      <Transition
        visible={this.state.allVisible}
        animation="fade up"
        duration={500}
      >
        <Grid>
          <Grid.Row />
          <Grid.Row />
          <Grid.Row />
          <Grid.Row style={{ height: "240px" }}>
            <Grid.Column width={1} />
            <Grid.Column
              width={14}
              style={{
                textAlign: "center"
              }}
            >
              <Transition
                visible={this.state.visible}
                animation="fade up"
                duration={500}
              >
                <div>
                  <h1 style={{ fontFamily: "comfortaa", fontStyle: "" }}>
                    {this.state.headerText}
                  </h1>
                  <h3 style={{ fontFamily: "comfortaa", fontStyle: "light" }}>
                    {this.state.descriptorText}
                  </h3>
                  <h4 style={{ fontFamily: "Open Sans", fontStyle: "light" }}>
                    {this.state.bodyText}
                  </h4>
                </div>
              </Transition>
            </Grid.Column>
            <Grid.Column width={1} />
          </Grid.Row>
          <Grid.Row style={{ textAlign: "center" }}>
            <Grid.Column mobile={3} computer={6} />
            <Grid.Column mobile={10} computer={4}>
              {this.languageOptions()}
            </Grid.Column>
            <Grid.Column mobile={3} computer={6} />
          </Grid.Row>
        </Grid>
      </Transition>
    );
  }
}

export const WelcomeBanner = myConnector(_WelcomeBanner);

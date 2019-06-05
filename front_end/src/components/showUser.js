import React from "react";
import SocketHandler from "../SocketHandler";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import history from "../history";
import format from "date-fns/format";

const socketIDs = [];

export default class ShowUser extends React.Component {
  state = {
    visible: false,
    headerText_t: "",
    buttonText_t: "",
    firstNameText: "",
    lastNameText: "",
    phoneNumber: "",
    emailText: "",
    languages: [],
    certifications: [],
    workEntries: [],
    skills: [],
    eduEntries: []
  };

  async componentDidMount() {

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "accountInfoReceived",
        async response => {
            let user_id = this.props.props.location.search.split("?user=")[1]
            console.log(response)
          let foundUser = response.accountInfo.accountUsers.find((user)=>{
              return user.uuid === user_id
          })
          console.log("FOUND USER: ", foundUser)
          this.setState({
            firstNameText: foundUser.first_name,
            lastNameText: foundUser.last_name,
            phoneNumber: foundUser.phone_number,
            emailText: foundUser.email,
            active_bio_id: foundUser.active_bio_id,
            user_id: foundUser.uuid
          });

          await SocketHandler.emit("requestUserAccountInfo", {
              user_id: foundUser.uuid,
          });
        }
      )
    );
    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userAccountInfoReceived",
        async response => {
            console.log(response)
          this.setState({
            languages: response.accountInfo.accountLangs,
            certifications: response.accountInfo.accountCerts,
          });

          await SocketHandler.emit("requestUserBioInfo", {
              user_id: this.state.user_id,
            bio_id: this.state.active_bio_id
          });
        }
      )
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userBioInfoReceived",
        async response => {
          console.log(this.state);
          console.log(response);
          this.setState({
            workEntries: response.bioInfo.workEntries,
            eduEntries: response.bioInfo.eduEntries
          });

          await SocketHandler.emit("requestUserSkillInfo", {
              user_id: this.state.user_id,
            bio_id: this.state.active_bio_id
          });
        }
      )
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userSkillInfoReceived",
        async response => {
          console.log(this.state);
          console.log(response);
          this.setState({
            skills: response.entryInfo.skills
          });

          await SocketHandler.emit("userTranslateText", {
            headerText: "This is your user's professional bio written in English.",
            buttonText: "Return to home"
          });
        }
      )
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userTextTranslated",
        async response => {
          console.log(response);
          this.setState({
            ...this.state,
            headerText_t: response.headerText,
            buttonText_t: response.buttonText
          });

          let payload = {};
          let n = 0;
          for (let language of this.state.languages) {
            if (
              language.name &&
              language.speaking_score &&
              language.writing_score
            ) {
              payload[`language_name_${n}`] = language.name;
              payload[`language_speaking_score_${n}`] = language.speaking_score;
              payload[`language_writing_score_${n}`] = language.writing_score;
              n++;
            }
          }
          let i = 0;
          for (let certification of this.state.certifications) {
            if (certification.description) {
              payload[`cert_${i}`] = certification.description;
              i++;
            }
          }
          let x = 0;
          for (let workEntry of this.state.workEntries) {
            if (workEntry.work_description && workEntry.position_title) {
              payload[`work_company_name_${x}`] = workEntry.company_name;
              payload[`work_position_title_${x}`] = workEntry.position_title;
              payload[`work_start_date_${x}`] = workEntry.start_date;
              payload[`work_finish_date_${x}`] = workEntry.finish_date;
              payload[`work_reference_contact_info_${x}`] =
                workEntry.reference_contact_info;
              payload[`work_description_${x}`] = workEntry.work_description;
              payload[`work_entry_id_${x}`] = workEntry.id;
              x++;
            }
          }
          let y = 0;
          for (let skill of this.state.skills) {
            if (skill.description) {
              payload[`skill_description_${y}`] = skill.description;
              payload[`skill_entry_id_${y}`] = skill.work_entry_id;
              y++;
            }
          }
          let z = 0;
          for (let eduEntry of this.state.eduEntries) {
            if (eduEntry.school_name && eduEntry.degree_type) {
              payload[`edu_school_name_${z}`] = eduEntry.school_name;
              payload[`edu_start_date_${z}`] = eduEntry.start_date;
              payload[`edu_finish_date_${z}`] = eduEntry.finish_date;
              payload[`edu_degree_type_${z}`] = eduEntry.degree_type;
              payload[`edu_degree_major_${z}`] = eduEntry.degree_major;
              z++;
            }
          }
          await SocketHandler.emit("userTranslateFinalText", {
            payload
          });
        }
      )
    );

    socketIDs.push(
      await SocketHandler.registerSocketListener(
        "userFinalTextTranslated",
        async response => {
          this.setState({
            ...this.state,
            payload: response,
            visible: true
          });
        }
      )
    );
    console.log("here");

    await SocketHandler.emit("requestAccountInfo")

    await SocketHandler.emit("requestUserAccountInfo", {
        user_id: this.props.props.location.search.split("?user=")[1]
    });
  }

  componentWillUnmount() {
    for (let i = 0; i < socketIDs.length; i++) {
      SocketHandler.unregisterSocketListener(socketIDs[i]);
    }
  }

  goHome = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      history.push("/");
    }, 500);
  };

  renderLanguageInfo = () => {
    console.log(';alsdjf;ajf;asjf;wejf;ajf;asdjf;ajf;aslkj')
    if (this.state.payload) {
      console.log(this.state.payload)
      let boxes = [];
      let n = 0;
      let languageInfo = [];
      for (let key in this.state.payload) {
        if (key.includes("language_")) {
          languageInfo.push(this.state.payload[key]);
        }
      }
      while (n < languageInfo.length / 3) {
        boxes.push(
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"h6"}>
                {this.state.payload[`language_name_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body1"}>
                • Speaking: {this.state.payload[`language_speaking_score_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body1"} style={{ marginBottom: "20px" }}>
                • Writing: {this.state.payload[`language_writing_score_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        );
        n++;
      }
      return boxes;
    }
  };

  renderCertifications = () => {
    if (this.state.payload) {
      let boxes = [];
      let n = 0;
      let certInfo = [];
      for (let key in this.state.payload) {
        if (key.includes("cert_")) {
          certInfo.push(this.state.payload[key]);
        }
      }
      while (n < certInfo.length) {
        boxes.push(
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10} style={{ marginBottom: "20px" }}>
              <Typography variant={"body2"}>
                • {this.state.payload[`cert_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        );
        n++;
      }
      return boxes;
    }
  };

  renderWorkEntries = () => {
    if (this.state.payload) {
      let boxes = [];
      let n = 0;
      let workInfo = [];
      let skillInfo = [];
      for (let key in this.state.payload) {
        if (key.includes("work_")) {
          workInfo.push(this.state.payload[key]);
        }
        if (key.includes("skill_")) {
          skillInfo.push(this.state.payload[key]);
        }
      }

      while (n < workInfo.length / 7) {
        let skills = [];
        let x = 0;
        while (x < skillInfo.length / 2) {
          if (
            this.state.payload[`skill_entry_id_${x}`] ===
            this.state.payload[`work_entry_id_${n}`]
          ) {
            skills.push(this.state.payload[`skill_description_${x}`]);
          }
          x++;
        }
        boxes.push(
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"h6"}>
                {this.state.payload[`work_company_name_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body2"}>
                {this.state.payload[`work_position_title_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body1"}>
                • {this.state.payload[`work_start_date_${n}`].split("-")[1]}/
                {this.state.payload[`work_start_date_${n}`].split("-")[0]} -{" "}
                {this.state.payload[`work_finish_date_${n}`].split("-")[1]}/
                {this.state.payload[`work_finish_date_${n}`].split("-")[0]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body1"}>
                • {this.state.payload[`work_description_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body1"}>
                • Skills Learned: {skills.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={1} />
                        <Grid item xs={1} />
            <Grid item xs={10} style={{ marginBottom: "20px" }}>
              <Typography variant={"body1"}>
                • Reference Contact: {this.state.payload[`work_reference_contact_info_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        );
        n++;
      }
      return boxes;
    }
  };

  renderEduEntries = () => {
    if (this.state.payload) {
      let boxes = [];
      let n = 0;
      let eduInfo = [];
      for (let key in this.state.payload) {
        if (key.includes("edu_")) {
          eduInfo.push(this.state.payload[key]);
        }
      }

      while (n < eduInfo.length / 5) {
        boxes.push(
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"h6"}>
                {this.state.payload[`edu_school_name_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10}>
              <Typography variant={"body1"}>
                • {this.state.payload[`edu_start_date_${n}`].split("-")[1]}/
                {this.state.payload[`edu_start_date_${n}`].split("-")[0]} -{" "}
                {this.state.payload[`edu_finish_date_${n}`].split("-")[1]}/
                {this.state.payload[`edu_finish_date_${n}`].split("-")[0]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={1} />
            <Grid item xs={10} style={{ marginBottom: "20px" }}>
              <Typography variant={"body1"}>
                • {this.state.payload[`edu_degree_type_${n}`]},{" "}
                {this.state.payload[`edu_degree_major_${n}`]}
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
        );
        n++;
      }
      return boxes;
    }
  };

  render() {
    return (
      <Fade in={this.state.visible} timeout={500} unmountOnExit={true}>
        <Grid container spacing={3}>
          <Grid item xs={12} />
          <Grid item xs={1} md={2} />
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
                <Grid item xs={1} />
                <Grid
                  item
                  xs={10}
                  style={{ marginTop: "40px", marginBottom: "10px" }}
                >
                  <Typography variant={"h4"}>Contact Info:</Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant={"h6"}>{`${this.state.firstNameText} ${
                    this.state.lastNameText
                  }`}</Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant={"body1"}>{`• ${
                    this.state.phoneNumber
                  }`}</Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid item xs={10}>
                  <Typography variant={"body1"}>
                    {`• ${this.state.emailText}`}
                  </Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={1} />
                <Grid
                  item
                  xs={10}
                  style={{ marginTop: "40px", marginBottom: "10px" }}
                >
                  <Typography variant={"h4"}>Languages Spoken:</Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={12}>
                  <Grid container>{this.renderLanguageInfo()}</Grid>
                </Grid>
                <Grid item xs={1} />
                <Grid
                  item
                  xs={10}
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                >
                  <Typography variant={"h4"}>Certifications:</Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={12}>
                  <Grid container>{this.renderCertifications()}</Grid>
                </Grid>
                <Grid item xs={1} />
                <Grid
                  item
                  xs={10}
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                >
                  <Typography variant={"h4"}>Work Experience:</Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={12}>
                  <Grid container>{this.renderWorkEntries()}</Grid>
                </Grid>
                <Grid item xs={1} />
                <Grid
                  item
                  xs={10}
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                >
                  <Typography variant={"h4"}>Education: </Typography>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={12}>
                  <Grid container>{this.renderEduEntries()}</Grid>
                </Grid>
                <Grid item xs={12} style={{ marginTop: "40px" }}>
                  <Button
                    variant="contained"
                    fullWidth
                    style={{
                      fontStyle: "light",
                      height: "100%"
                    }}
                    onClick={this.goHome}
                  >
                    {this.state.buttonText_t}
                    <KeyboardArrowRightIcon />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3} />
        </Grid>
      </Fade>
    );
  }
}

const pry = require("pryjs");

const express = require("express");

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
// const socketIo = require("socket.io")

server.listen(80);

const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
//require models
const Advocate = require("./models/Advocate");
const User = require("./models/User");
const Bio = require("./models/Bio");
const EducationEntry = require("./models/EducationEntry");
const WorkEntry = require("./models/WorkEntry");
const Language = require("./models/Language");
const Certification = require("./models/Certification");
const Skill = require("./models/Skill");
// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate");

// Your Google Cloud Platform project ID
const projectId = "translation-advo-1558037598471";

// Instantiates a client
const translator = new Translate({
  projectId: projectId
});

const Op = Sequelize.Op;

// SOCKET.IO
// const io = socketIo(8080, {
//   handlePreflightRequest: function(req, res) {
//     let headers = {
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Origin": "http://10.185.7.186:3000",
//       "Access-Control-Allow-Credentials": true
//     };
//     res.writeHead(200, headers);
//     res.end();
//   }
// });

io.on("connection", async socket => {
  if (socket.handshake.headers.authorization !== "Bearer null") {
    let [type, token] = socket.handshake.headers.authorization.split(" ");
    let result = jwt.decode(token);
    let accountID = result.id;
    let secureAdvocate = await Advocate.findOne({
      where: { uuid: accountID },
      attributes: { exclude: ["password_digest", "uuid"] }
    });
    let secureUser = await User.findOne({
      where: { uuid: accountID },
      attributes: { exclude: ["password_digest", "uuid"] }
    });
    let foundAdvocate = await Advocate.findOne({
      where: { uuid: accountID },
      attributes: { exclude: ["password_digest"] }
    });
    let foundUser = await User.findOne({
      where: { uuid: accountID },
      attributes: { exclude: ["password_digest"] }
    });
    let account_language = "";
    if (foundAdvocate !== null) {
      account_language = foundAdvocate.language;
    } else if (foundUser !== null) {
      account_language = foundUser.language;
    }

    //socket connections for user model
    socket.on("requestBioInfo", async payload => {
      if (payload.id) {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.id;
        });
        let eduEntries = await EducationEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        let workEntries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        await socket.emit("bioInfoReceived", {
          bioInfo: {
            bioStuff: activeBio,
            workEntries: workEntries,
            eduEntries: eduEntries
          }
        });
      }
    });

    socket.on("requestUserBioInfo", async payload => {
      if (payload.bio_id) {
        let accountBios = await Bio.findAll({
          where: { account_id: payload.user_id },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.bio_id;
        });
        let eduEntries = await EducationEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        let workEntries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        console.log(activeBio);
        console.log(eduEntries);
        console.log(workEntries);
        await socket.emit("userBioInfoReceived", {
          bioInfo: {
            bioStuff: activeBio,
            workEntries: workEntries,
            eduEntries: eduEntries
          }
        });
      }
    });

    socket.on("requestBioInfoEdu", async payload => {
      if (payload.id) {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.id;
        });
        let eduEntries = await EducationEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        let workEntries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        await socket.emit("bioInfoRecieved", {
          bioInfo: {
            bioStuff: activeBio,
            workEntries: workEntries,
            eduEntries: eduEntries
          }
        });
        await socket.emit("renderEduPage");
      } else {
        console.log("no bio id given...");
      }
    });

    socket.on("requestBioInfoWork", async payload => {
      if (payload.id) {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.id;
        });
        let eduEntries = await EducationEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        let workEntries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        await socket.emit("bioInfoRecieved", {
          bioInfo: {
            bioStuff: activeBio,
            workEntries: workEntries,
            eduEntries: eduEntries
          }
        });
        await socket.emit("renderWorkPage");
      } else {
        console.log("no bio id given...");
      }
    });

    socket.on("requestWorkEntryInfo", async payload => {
      if (payload.bio_id) {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.bio_id;
        });
        let entries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        let activeEntry = entries.find(entry => {
          return entry.id === payload.entry_id;
        });
        let skills = await Skill.findAll({
          where: { work_entry_id: activeEntry.id }
        });
        await socket.emit("workEntryInfoReceived", {
          entryInfo: {
            entryStuff: activeEntry,
            skills: skills
          }
        });
      }
    });

    socket.on("requestSkillInfo", async payload => {
      if (payload.bio_id) {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.bio_id;
        });
        let entries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        entryIds = [];
        entries.forEach(entry => {
          entryIds.push(entry.id);
        });
        let entrySkills = await Skill.findAll({
          where: {
            work_entry_id: {
              [Op.or]: entryIds
            }
          }
        });
        await socket.emit("skillInfoReceived", {
          entryInfo: {
            entries: entries,
            skills: entrySkills
          }
        });
      }
    });

    socket.on("requestUserSkillInfo", async payload => {
      if (payload.bio_id) {
        let accountBios = await Bio.findAll({
          where: { account_id: payload.user_id },
          attributes: { exclude: "account_id", include: "id" }
        });
        let activeBio = accountBios.find(bio => {
          return bio.id === payload.bio_id;
        });
        let entries = await WorkEntry.findAll({
          where: { bio_id: activeBio.id }
        });
        entryIds = [];
        entries.forEach(entry => {
          entryIds.push(entry.id);
        });
        let entrySkills = await Skill.findAll({
          where: {
            work_entry_id: {
              [Op.or]: entryIds
            }
          }
        });
        await socket.emit("userSkillInfoReceived", {
          entryInfo: {
            entries: entries,
            skills: entrySkills
          }
        });
      }
    });

    socket.on("requestAccountInfo", async () => {
      if (foundAdvocate !== null) {
        let accountUsers = await User.findAll({
          where: { advocate_id: accountID },
          attributes: { exclude: "password_digest" }
        });
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let accountLangs = await Language.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id" }
        });
        let accountCerts = await Certification.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id" }
        });
        socket.emit("accountInfoReceived", {
          accountInfo: {
            accountStuff: secureAdvocate,
            accountUsers: accountUsers,
            accountBios: accountBios,
            accountLangs: accountLangs,
            accountCerts: accountCerts
          }
        });
      } else if (foundUser !== null && foundUser.has_account === "true") {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let accountLangs = await Language.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id" }
        });
        let accountCerts = await Certification.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id" }
        });
        socket.emit("accountInfoReceived", {
          accountInfo: {
            accountStuff: secureUser,
            accountUsers: null,
            accountBios: accountBios,
            accountLangs: accountLangs,
            accountCerts: accountCerts
          }
        });
      } else {
        let accountBios = await Bio.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id", include: "id" }
        });
        let accountLangs = await Language.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id" }
        });
        let accountCerts = await Certification.findAll({
          where: { account_id: accountID },
          attributes: { exclude: "account_id" }
        });
        socket.emit("accountInfoReceived", {
          accountInfo: {
            accountStuff: secureUser,
            accountUsers: null,
            accountBios: accountBios,
            accountLangs: accountLangs,
            accountCerts: accountCerts
          }
        });
      }
    });

    socket.on("requestUserAccountInfo", async payload => {
      let accountBios = await Bio.findAll({
        where: { account_id: payload.user_id },
        attributes: { exclude: "account_id", include: "id" }
      });
      let accountLangs = await Language.findAll({
        where: { account_id: payload.user_id },
        attributes: { exclude: "account_id" }
      });
      let accountCerts = await Certification.findAll({
        where: { account_id: payload.user_id },
        attributes: { exclude: "account_id" }
      });
      socket.emit("userAccountInfoReceived", {
        accountInfo: {
          accountStuff: secureUser,
          accountUsers: null,
          accountBios: accountBios,
          accountLangs: accountLangs,
          accountCerts: accountCerts
        }
      });
    });

    socket.on("translateDashboard", async payload => {
      if (account_language !== "en") {
        const options = {
          to: account_language,
          model: "nmt"
        };
        let homeTextResults = await translator.translate(
          payload.homeText,
          options
        );
        const translatedHome = homeTextResults[0];
        let logoutTextResults = await translator.translate(
          payload.logoutText,
          options
        );
        const translatedLogout = logoutTextResults[0];
        let usersTextResults = await translator.translate(
          payload.usersText,
          options
        );
        const translatedUsers = usersTextResults[0];
        let inviteUserTextResults = await translator.translate(
          payload.inviteUserText,
          options
        );
        const translatedInviteUser = inviteUserTextResults[0];
        let resumesTextResults = await translator.translate(
          payload.resumesText,
          options
        );
        const translatedResumes = resumesTextResults[0];
        let createResumeTextResults = await translator.translate(
          payload.createResumeText,
          options
        );
        const translatedCreateResume = createResumeTextResults[0];
        socket.emit("dashboardTranslated", {
          returnedHomeText: translatedHome,
          returnedLogoutText: translatedLogout,
          returnedUsersText: translatedUsers,
          returnedInviteUserText: translatedInviteUser,
          returnedResumesText: translatedResumes,
          returnedCreateResumeText: translatedCreateResume
        });
      } else {
        socket.emit("dashboardTranslated", {
          returnedHomeText: payload.homeText,
          returnedLogoutText: "Log out",
          returnedUsersText: payload.usersText,
          returnedInviteUserText: payload.inviteUserText,
          returnedResumesText: payload.resumesText,
          returnedCreateResumeText: payload.createResumeText
        });
      }
    });

    socket.on("translateHome", async payload => {
      if (account_language !== "en") {
        const options = {
          to: account_language,
          model: "nmt"
        };
        const response = {};
        for (let keyText in payload) {
          let results = await translator.translate(payload[keyText], options);
          response[keyText] = results[0];
        }
        socket.emit("homeTranslated", response);
      } else {
        socket.emit("homeTranslated", {
          a_descriptorText: "Welcome to your advocate dashboard.",
          a_inviteBodyText:
            "As an advocate, you can invite someone to create a resume in their own language and then review it for them. You may also use the menu to do this.",
          a_inviteButtonText: "Invite a user",
          a_resumeBodyText:
            "You're able to create your own resumes here.  You may access them later using the menu at the left of the screen.",
          a_resumeButtonText: "Create a resume",
          u_descriptorText: "Welcome to your user dashboard.",
          u_resumeBodyText:
            "As a user, you can create an English resume by answering questions in your own language.  Click here to create a resume.",
          u_resumeButtonText: "Create a resume"
        });
      }
    });

    // socket.on("translateResumeIntro", async payload => {
    //   if (account_language !== "en") {
    //     const options = {
    //       to: account_language,
    //       model: "nmt"
    //     };
    //     const response = {};
    //     for (let keyText in payload) {
    //       let results = await translator.translate(payload[keyText], options);
    //       response[keyText] = results[0];
    //     }
    //     socket.emit("resumeIntroTranslated", response);
    //   } else {
    //     socket.emit("resumeIntroTranslated", payload);
    //   }
    // });

    // socket.on("translateContactInfo", async payload => {
    //   if (account_language !== "en") {
    //     const options = {
    //       to: account_language,
    //       model: "nmt"
    //     };
    //     const response = {};
    //     for (let keyText in payload) {
    //       let results = await translator.translate(payload[keyText], options);
    //       response[keyText] = results[0];
    //     }
    //     socket.emit("contactInfoTranslated", response);
    //   } else {
    //     socket.emit("contactInfoTranslated", payload);
    //   }
    // });

    // socket.on("translateWorkEntry", async payload => {
    //   if (account_language !== "en") {
    //     const options = {
    //       to: account_language,
    //       model: "nmt"
    //     };
    //     const response = {};
    //     for (let keyText in payload) {
    //       let results = await translator.translate(payload[keyText], options);
    //       response[keyText] = results[0];
    //     }
    //     socket.emit("workEntryTranslated", response);
    //   } else {
    //     socket.emit("workEntryTranslated", payload);
    //   }
    // });

    socket.on("translateText", async payload => {
      if (account_language !== "en") {
        const options = {
          to: account_language,
          model: "nmt"
        };
        const response = {};
        for (let keyText in payload) {
          let results = await translator.translate(payload[keyText], options);
          response[keyText] = results[0];
        }
        socket.emit("textTranslated", response);
      } else {
        socket.emit("textTranslated", payload);
      }
    });

    socket.on("userTranslateText", async payload => {
      if (account_language !== "en") {
        const options = {
          to: account_language,
          model: "nmt"
        };
        const response = {};
        for (let keyText in payload) {
          let results = await translator.translate(payload[keyText], options);
          response[keyText] = results[0];
        }
        socket.emit("userTextTranslated", response);
      } else {
        socket.emit("userTextTranslated", payload);
      }
    });

    socket.on("translateFinalText", async ({ payload }) => {
      // console.log(payload);
      const options = {
        to: "en",
        model: "nmt"
      };
      const response = {};
      for (let keyText in payload) {
        console.log(keyText);
        if (
          keyText.includes("_score_") ||
          keyText.includes("_date_") ||
          keyText.includes("_contact_info_") ||
          keyText.includes("_company_name_") ||
          keyText.includes("_id_")
        ) {
          console.log(
            "____________________________________________________INHERE______________________________________________________________________________________"
          );
          response[keyText] = payload[keyText];
        } else {
          let results = await translator.translate(payload[keyText], options);
          response[keyText] = results[0];
        }
      }
      socket.emit("finalTextTranslated", response);
    });

    socket.on("userTranslateFinalText", async ({ payload }) => {
      // console.log(payload);
      const options = {
        to: "en",
        model: "nmt"
      };
      const response = {};
      for (let keyText in payload) {
        console.log(keyText);
        if (
          keyText.includes("_score_") ||
          keyText.includes("_date_") ||
          keyText.includes("_contact_info_") ||
          keyText.includes("_company_name_") ||
          keyText.includes("_id_")
        ) {
          console.log(
            "____________________________________________________INHERE______________________________________________________________________________________"
          );
          response[keyText] = payload[keyText];
        } else {
          let results = await translator.translate(payload[keyText], options);
          response[keyText] = results[0];
        }
      }
      socket.emit("userFinalTextTranslated", response);
    });

    socket.on("createNewBio", async () => {
      let newBio = await Bio.build();
      newBio.account_id = accountID;
      await newBio.save();
      socket.emit("bioCreated", {
        createdBio: newBio
      });
    });

    socket.on("finishBio", async payload => {
      console.log(payload);
      let bio = await Bio.findByPk(payload.bio_id);
      console.log(bio);
      bio.finished = true;
      await bio.save();
      socket.emit("bioFinished");
    });

    socket.on("updateUser", async payload => {
      if (foundAdvocate !== null) {
        console.log(payload);
        for (let keyText in payload) {
          foundAdvocate[keyText] = await payload[keyText];
          secureAdvocate[keyText] = await payload[keyText];
        }
        await foundAdvocate.save();
        console.log(foundAdvocate);
      } else if (foundUser !== null) {
        for (let keyText in payload) {
          foundUser[keyText] = await payload[keyText];
          secureUser[keyText] = await payload[keyText];
        }
        await foundUser.save();
      }
      socket.emit("userUpdated");
    });

    socket.on("setActiveBio", async payload => {
      if (foundAdvocate !== null) {
        console.log(payload);
        foundAdvocate.active_bio_id = payload.id;
        secureAdvocate.active_bio_id = payload.id;
        await foundAdvocate.save();
      } else if (foundUser !== null) {
        foundUser.active_bio_id = payload.id;
        secureUser.active_bio_id = payload.id;
        await foundUser.save();
      }
      socket.emit("activeBioSet");
    });

    socket.on("addLanguages", async payload => {
      Language.destroy({ where: { account_id: accountID } });
      for (let language of payload.languageData) {
        if (
          language.name !== "" &&
          language.speaking !== "" &&
          language.writing !== ""
        ) {
          let newLanguage = await Language.build();
          newLanguage.name = language.name;
          newLanguage.speaking_score = language.speaking;
          newLanguage.writing_score = language.writing;
          newLanguage.account_id = accountID;
          await newLanguage.save();
        }
      }
      socket.emit("languagesAdded");
    });

    socket.on("addCerts", async payload => {
      Certification.destroy({ where: { account_id: accountID } });
      for (let certification of payload.certData) {
        if (certification !== "") {
          let newCertification = await Certification.build();
          newCertification.description = certification;
          newCertification.account_id = accountID;
          await newCertification.save();
        }
      }
      socket.emit("certsAdded");
    });

    socket.on("addSkills", async payload => {
      Skill.destroy({ where: { work_entry_id: payload.entry_id } });
      for (let skill of payload.skillData) {
        if (skill !== "") {
          let newSkill = await Skill.build();
          newSkill.description = skill;
          newSkill.work_entry_id = payload.entry_id;
          await newSkill.save();
        }
      }
      socket.emit("skillsAdded");
    });

    socket.on("createEduEntry", async payload => {
      let newEduEntry = await EducationEntry.build();
      newEduEntry.bio_id = payload.bio_id;
      await newEduEntry.save();
      socket.emit("eduEntryCreated", {
        newEduEntry: newEduEntry
      });
    });

    socket.on("saveEduEntry", async payload => {
      let eduEntry = await EducationEntry.findByPk(payload.id);
      eduEntry.school_name = payload.schoolName || "N/A";
      eduEntry.start_date = payload.startDate;
      eduEntry.finish_date = payload.finishDate;
      eduEntry.degree_type = payload.degreeType || "N/A";
      eduEntry.degree_major = payload.degreeMajor || "N/A";
      await eduEntry.save();
      socket.emit("eduEntrySaved");
    });

    socket.on("createWorkEntry", async payload => {
      let newWorkEntry = await WorkEntry.build();
      newWorkEntry.bio_id = payload.bio_id;
      await newWorkEntry.save();
      socket.emit("workEntryCreated", {
        newWorkEntry: newWorkEntry
      });
    });

    socket.on("saveWorkEntry", async payload => {
      let workEntry = await WorkEntry.findByPk(payload.id);
      workEntry.company_name = payload.companyName || "N/A";
      workEntry.start_date = payload.startDate;
      workEntry.finish_date = payload.finishDate;
      workEntry.position_title = payload.positionTitle || "N/A";
      workEntry.work_description = payload.workDescription || "N/A";
      workEntry.reference_contact_info = payload.reference || "N/A";
      await workEntry.save();
      socket.emit("workEntrySaved");
    });

    socket.on("createResumeRequestee", async payload => {
      console.log("in here");
      let newUser = await User.build();
      if (payload.firstName) {
        newUser.first_name = payload.firstName;
      }
      if (payload.lastName) {
        newUser.last_name = payload.lastName;
      }
      if (payload.selectedLanguage) {
        newUser.language = payload.selectedLanguage;
      }
      newUser.advocate_id = foundAdvocate.uuid;
      await newUser.save();
      console.log("saved!");
      socket.emit("resumeRequesteeCreated", {
        createdRequestee: newUser
      });
    });
  }

  socket.on("welcomeBannerTranslate", async payload => {
    const options = {
      to: payload.language,
      model: "nmt"
    };
    let headerResults = await translator.translate(payload.headerText, options);
    const translatedHeader = headerResults[0];
    let descriptorResults = await translator.translate(
      payload.descriptorText,
      options
    );
    const translatedDescriptor = descriptorResults[0];
    let bodyResults = await translator.translate(payload.bodyText, options);
    const translatedBody = bodyResults[0];
    socket.emit("bannerTranslated", {
      returnedHeader: translatedHeader,
      returnedDescriptor: translatedDescriptor,
      returnedBody: translatedBody
    });
  });

  socket.on("translateUserSelect", async payload => {
    if (payload.language !== "en" && payload.language !== "") {
      const options = {
        to: payload.language,
        model: "nmt"
      };
      let descriptorTextResults = await translator.translate(
        payload.descriptorText,
        options
      );
      const translatedDescriptor = descriptorTextResults[0];
      let advocateHeaderTextResults = await translator.translate(
        payload.advocateHeaderText,
        options
      );
      const translatedAdvocateHeader = advocateHeaderTextResults[0];
      let advocateDescriptorTextResults = await translator.translate(
        payload.advocateDescriptorText,
        options
      );
      const translatedAdvocateDescriptor = advocateDescriptorTextResults[0];
      let userHeaderTextResults = await translator.translate(
        payload.userHeaderText,
        options
      );
      const translatedUserHeader = userHeaderTextResults[0];
      let userDescriptorTextResults = await translator.translate(
        payload.userDescriptorText,
        options
      );
      const translatedUserDescriptor = userDescriptorTextResults[0];
      let loginTextResults = await translator.translate(
        payload.loginText,
        options
      );
      const translatedLogin = loginTextResults[0];
      let goBackTextResults = await translator.translate(
        payload.goBackText,
        options
      );
      const translatedGoBack = goBackTextResults[0];
      socket.emit("userSelectTranslated", {
        returnedDescriptor: translatedDescriptor,
        returnedAdvocateHeader: translatedAdvocateHeader,
        returnedAdvocateDescriptor: translatedAdvocateDescriptor,
        returnedUserHeader: translatedUserHeader,
        returnedUserDescriptor: translatedUserDescriptor,
        returnedLoginText: translatedLogin,
        returnedGoBackText: translatedGoBack
      });
    } else {
      socket.emit("userSelectTranslated", {
        returnedDescriptor: payload.descriptorText,
        returnedAdvocateHeader: "Advocate",
        returnedAdvocateDescriptor: payload.advocateDescriptorText,
        returnedUserHeader: payload.userHeaderText,
        returnedUserDescriptor: payload.userDescriptorText,
        returnedLoginText: payload.loginText,
        returnedGoBackText: payload.goBackText
      });
    }
  });

  socket.on("translateUserSignup", async payload => {
    if (payload.language !== "en") {
      const options = {
        to: payload.language,
        model: "nmt"
      };
      let descriptorTextResults = await translator.translate(
        payload.descriptorText,
        options
      );
      const translatedDescriptor = descriptorTextResults[0];
      let signupHeaderTextResults = await translator.translate(
        payload.signupHeaderText,
        options
      );
      const translatedSignupHeader = signupHeaderTextResults[0];
      let loginHeaderTextResults = await translator.translate(
        payload.loginHeaderText,
        options
      );
      const translatedLoginHeader = loginHeaderTextResults[0];
      // let firstNameLabelTextResults = await translator.translate(
      //   payload.firstNameLabelText,
      //   options
      // );
      // const translatedFirstNameLabel = firstNameLabelTextResults[0];
      // let lastNameLabelTextResults = await translator.translate(
      //   payload.lastNameLabelText,
      //   options
      // );
      // const translatedLastNameLabel = lastNameLabelTextResults[0];
      let passwordLabelTextResults = await translator.translate(
        payload.passwordLabelText,
        options
      );
      const translatedPasswordLabel = passwordLabelTextResults[0];
      let confirmPasswordLabelTextResults = await translator.translate(
        payload.confirmPasswordLabelText,
        options
      );
      const translatedConfirmPasswordLabel = confirmPasswordLabelTextResults[0];
      let loginTextResults = await translator.translate(
        payload.loginText,
        options
      );
      const translatedLogin = loginTextResults[0];
      let goBackTextResults = await translator.translate(
        payload.goBackText,
        options
      );
      const translatedGoBack = goBackTextResults[0];
      let createAccountTextResults = await translator.translate(
        payload.createAccountText,
        options
      );
      const translatedCreateAccountText = createAccountTextResults[0];
      let emailLabelTextResults = await translator.translate(
        payload.emailLabelText,
        options
      );
      const translatedEmailLabelText = emailLabelTextResults[0];
      let requiredFieldTextResults = await translator.translate(
        payload.requiredFieldText,
        options
      );
      const translatedRequiredFieldText = requiredFieldTextResults[0];
      let validEmailTextResults = await translator.translate(
        payload.validEmailText,
        options
      );
      const translatedValidEmailText = validEmailTextResults[0];
      let passwordLengthTextResults = await translator.translate(
        payload.passwordLengthText,
        options
      );
      const translatedPasswordLengthText = passwordLengthTextResults[0];
      let passwordMatchTextResults = await translator.translate(
        payload.passwordMatchText,
        options
      );
      const translatedPasswordMatchText = passwordMatchTextResults[0];
      socket.emit("userSignupTranslated", {
        returnedDescriptor: translatedDescriptor,
        returnedSignupHeader: translatedSignupHeader,
        returnedLoginHeader: translatedLoginHeader,
        // returnedFirstNameLabel: translatedFirstNameLabel,
        // returnedLastNameLabel: translatedLastNameLabel,
        returnedPasswordLabel: translatedPasswordLabel,
        returnedConfirmPasswordLabel: translatedConfirmPasswordLabel,
        returnedLoginText: translatedLogin,
        returnedGoBackText: translatedGoBack,
        returnedCreateAccountText: translatedCreateAccountText,
        returnedEmailLabelText: translatedEmailLabelText,
        requiredFieldText: translatedRequiredFieldText,
        validEmailText: translatedValidEmailText,
        passwordLengthText: translatedPasswordLengthText,
        passwordMatchText: translatedPasswordMatchText
      });
    } else {
      socket.emit("userSignupTranslated", {
        returnedDescriptor: payload.descriptorText,
        returnedSignupHeader: payload.signupHeaderText,
        returnedLoginHeader: payload.loginHeaderText,
        // returnedFirstNameLabel: payload.firstNameLabelText,
        // returnedLastNameLabel: payload.lastNameLabelText,
        returnedPasswordLabel: payload.passwordLabelText,
        returnedConfirmPasswordLabel: payload.confirmPasswordLabelText,
        returnedLoginText: payload.loginText,
        returnedGoBackText: payload.goBackText,
        returnedCreateAccountText: payload.createAccountText,
        returnedEmailLabelText: payload.emailLabelText,
        requiredFieldText: payload.requiredFieldText,
        validEmailText: payload.validEmailText,
        passwordLengthText: payload.passwordLengthText,
        passwordMatchText: payload.passwordMatchText
      });
    }
  });

  socket.on("translateAdvocateSignup", async payload => {
    if (payload.language !== "en") {
      const options = {
        to: payload.language,
        model: "nmt"
      };
      let descriptorTextResults = await translator.translate(
        payload.descriptorText,
        options
      );
      const translatedDescriptor = descriptorTextResults[0];
      let signupHeaderTextResults = await translator.translate(
        payload.signupHeaderText,
        options
      );
      const translatedSignupHeader = signupHeaderTextResults[0];
      let loginHeaderTextResults = await translator.translate(
        payload.loginHeaderText,
        options
      );
      const translatedLoginHeader = loginHeaderTextResults[0];
      let firstNameLabelTextResults = await translator.translate(
        payload.firstNameLabelText,
        options
      );
      const translatedFirstNameLabel = firstNameLabelTextResults[0];
      let lastNameLabelTextResults = await translator.translate(
        payload.lastNameLabelText,
        options
      );
      const translatedLastNameLabel = lastNameLabelTextResults[0];
      let passwordLabelTextResults = await translator.translate(
        payload.passwordLabelText,
        options
      );
      const translatedPasswordLabel = passwordLabelTextResults[0];
      let confirmPasswordLabelTextResults = await translator.translate(
        payload.confirmPasswordLabelText,
        options
      );
      const translatedConfirmPasswordLabel = confirmPasswordLabelTextResults[0];
      let loginTextResults = await translator.translate(
        payload.loginText,
        options
      );
      const translatedLogin = loginTextResults[0];
      let goBackTextResults = await translator.translate(
        payload.goBackText,
        options
      );
      const translatedGoBack = goBackTextResults[0];
      let createAccountTextResults = await translator.translate(
        payload.createAccountText,
        options
      );
      const translatedCreateAccountText = createAccountTextResults[0];
      let emailLabelTextResults = await translator.translate(
        payload.emailLabelText,
        options
      );
      const translatedEmailLabelText = emailLabelTextResults[0];
      let requiredFieldTextResults = await translator.translate(
        payload.requiredFieldText,
        options
      );
      const translatedRequiredFieldText = requiredFieldTextResults[0];
      let validEmailTextResults = await translator.translate(
        payload.validEmailText,
        options
      );
      const translatedValidEmailText = validEmailTextResults[0];
      let passwordLengthTextResults = await translator.translate(
        payload.passwordLengthText,
        options
      );
      const translatedPasswordLengthText = passwordLengthTextResults[0];
      let passwordMatchTextResults = await translator.translate(
        payload.passwordMatchText,
        options
      );
      const translatedPasswordMatchText = passwordMatchTextResults[0];
      socket.emit("advocateSignupTranslated", {
        returnedDescriptor: translatedDescriptor,
        returnedSignupHeader: translatedSignupHeader,
        returnedLoginHeader: translatedLoginHeader,
        returnedFirstNameLabel: translatedFirstNameLabel,
        returnedLastNameLabel: translatedLastNameLabel,
        returnedPasswordLabel: translatedPasswordLabel,
        returnedConfirmPasswordLabel: translatedConfirmPasswordLabel,
        returnedLoginText: translatedLogin,
        returnedGoBackText: translatedGoBack,
        returnedCreateAccountText: translatedCreateAccountText,
        returnedEmailLabelText: translatedEmailLabelText,
        requiredFieldText: translatedRequiredFieldText,
        validEmailText: translatedValidEmailText,
        passwordLengthText: translatedPasswordLengthText,
        passwordMatchText: translatedPasswordMatchText
      });
    } else {
      socket.emit("advocateSignupTranslated", {
        returnedDescriptor: payload.descriptorText,
        returnedSignupHeader: "Create Advocate Account",
        returnedLoginHeader: payload.loginHeaderText,
        returnedFirstNameLabel: payload.firstNameLabelText,
        returnedLastNameLabel: payload.lastNameLabelText,
        returnedPasswordLabel: payload.passwordLabelText,
        returnedConfirmPasswordLabel: payload.confirmPasswordLabelText,
        returnedLoginText: payload.loginText,
        returnedGoBackText: payload.goBackText,
        returnedCreateAccountText: payload.createAccountText,
        returnedEmailLabelText: payload.emailLabelText,
        requiredFieldText: payload.requiredFieldText,
        validEmailText: payload.validEmailText,
        passwordLengthText: payload.passwordLengthText,
        passwordMatchText: payload.passwordMatchText
      });
    }
  });

  socket.on("translateLogin", async payload => {
    if (payload.language !== "en") {
      const options = {
        to: payload.language,
        model: "nmt"
      };
      let descriptorTextResults = await translator.translate(
        payload.descriptorText,
        options
      );
      const translatedDescriptor = descriptorTextResults[0];

      let passwordLabelTextResults = await translator.translate(
        payload.passwordLabelText,
        options
      );
      const translatedPasswordLabel = passwordLabelTextResults[0];

      let loginTextResults = await translator.translate(
        payload.loginText,
        options
      );
      const translatedLogin = loginTextResults[0];
      let goBackTextResults = await translator.translate(
        payload.goBackText,
        options
      );
      const translatedGoBack = goBackTextResults[0];

      let emailLabelTextResults = await translator.translate(
        payload.emailLabelText,
        options
      );
      const translatedEmailLabelText = emailLabelTextResults[0];
      let requiredFieldTextResults = await translator.translate(
        payload.requiredFieldText,
        options
      );
      const translatedRequiredFieldText = requiredFieldTextResults[0];
      let validEmailTextResults = await translator.translate(
        payload.validEmailText,
        options
      );
      const translatedValidEmailText = validEmailTextResults[0];
      let passwordLengthTextResults = await translator.translate(
        payload.passwordLengthText,
        options
      );
      const translatedPasswordLengthText = passwordLengthTextResults[0];
      let passwordMatchTextResults = await translator.translate(
        payload.passwordMatchText,
        options
      );
      const translatedPasswordMatchText = passwordMatchTextResults[0];
      let authenticateTextResults = await translator.translate(
        payload.authenticateText,
        options
      );
      const translatedAuthenticateText = authenticateTextResults[0];
      socket.emit("loginTranslated", {
        returnedDescriptor: translatedDescriptor,
        returnedPasswordLabel: translatedPasswordLabel,
        returnedLoginText: translatedLogin,
        returnedGoBackText: translatedGoBack,
        returnedEmailLabelText: translatedEmailLabelText,
        requiredFieldText: translatedRequiredFieldText,
        validEmailText: translatedValidEmailText,
        passwordLengthText: translatedPasswordLengthText,
        passwordMatchText: translatedPasswordMatchText,
        authenticateText: translatedAuthenticateText
      });
    } else {
      socket.emit("loginTranslated", {
        returnedDescriptor: payload.descriptorText,
        returnedPasswordLabel: payload.passwordLabelText,
        returnedLoginText: payload.loginText,
        returnedGoBackText: payload.goBackText,
        returnedEmailLabelText: payload.emailLabelText,
        requiredFieldText: payload.requiredFieldText,
        validEmailText: payload.validEmailText,
        passwordLengthText: payload.passwordLengthText,
        passwordMatchText: payload.passwordMatchText,
        authenticateText: payload.authenticateText
      });
    }
  });

  socket.on("createUserAccount", async payload => {
    let newUser = await User.build();
    newUser.email = payload.email;
    // newUser.first_name = payload.firstName;
    // newUser.last_name = payload.lastName;
    newUser.password = payload.password;
    newUser.language = payload.language;
    newUser.has_account = true;
    // newUser.account_type = "user";
    await newUser.save();
    socket.emit("userAccountCreated", {
      createdUser: newUser
    });
  });

  socket.on("createAdvocateAccount", async payload => {
    let newAdvocate = await Advocate.build();
    newAdvocate.email = payload.email;
    newAdvocate.first_name = payload.firstName;
    newAdvocate.last_name = payload.lastName;
    newAdvocate.password = payload.password;
    newAdvocate.language = payload.language;
    // newAdvocate.account_type = "advocate";
    await newAdvocate.save();
    socket.emit("advocateAccountCreated", {
      createdAdvocate: newAdvocate
    });
  });

  socket.on("login", async payload => {
    let foundUser = await User.findOne({
      where: {
        email: payload.email
      }
    });
    let foundAdvocate = await Advocate.findOne({
      where: {
        email: payload.email
      }
    });
    if (
      foundAdvocate !== null &&
      foundAdvocate.authenticate(payload.password)
    ) {
      socket.emit("advocateLoggedIn", {
        advocateInfo: foundAdvocate
      });
    } else if (foundUser !== null && foundUser.authenticate(payload.password)) {
      socket.emit("userLoggedIn", {
        userInfo: foundUser
      });
    } else {
      socket.emit("invalidLogin");
    }
  });
});

app.use("/static", express.static("public/static"));
app.use("/*", (req, res) => res.sendFile(path.resolve("./public/index.html")));

// npm packages across socket and express
const pry = require("pryjs");
const jwt = require("jsonwebtoken");
const socketIo = require("socket.io");
//require models
const Advocate = require("./models/Advocate");
const User = require("./models/User");
const Bio = require("./models/Bio");
const EducationEntry = require("./models/EducationEntry");
const WorkEntry = require("./models/WorkEntry");
// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate");

// Your Google Cloud Platform project ID
const projectId = "translation-advo-1558037598471";

// Instantiates a client
const translator = new Translate({
  projectId: projectId
});

// SOCKET.IO
const io = socketIo(8080, {
  handlePreflightRequest: function(req, res) {
    let headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": "http://10.185.3.9:3000",
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }
});

io.on("connection", async socket => {
  if (socket.handshake.headers.authorization !== "Bearer null") {
    let [type, token] = socket.handshake.headers.authorization.split(" ");
    let result = jwt.decode(token);
    let accountID = result.id;
    let foundAdvocate = await Advocate.findOne({
      where: { uuid: accountID },
      attributes: { exclude: ["password_digest", "uuid"] }
    });
    let foundUser = await User.findOne({
      where: { uuid: accountID },
      attributes: { exclude: ["password_digest", "uuid"] }
    });
    let account_language = "";
    if (foundAdvocate !== null) {
      account_language = foundAdvocate.language;
    } else if (foundUser !== null) {
      account_language = foundUser.language;
    }

    //socket connections for user model
    socket.on("requestAccountInfo", async () => {
      if (foundAdvocate !== null) {
        console.log("you got to the dashboard with an advocate acct.");
        accountUsers = await User.findAll({
          where: { advocate_id: accountID },
          attributes: { exclude: "password_digest" }
        });
        console.log(foundAdvocate);
        console.log("accountUsers: ", accountUsers);
        socket.emit("accountInfoReceived", {
          accountInfo: foundAdvocate,
          accountUsers: accountUsers
        });
      } else if (foundUser !== null && foundUser.has_account === "true") {
        console.log(foundUser);
        socket.emit("accountInfoReceived", {
          accountInfo: foundUser,
          accountUsers: null
        });
      } else {
        console.log(foundUser);
        socket.emit("accountInfoReceived", {
          accountInfo: foundUser,
          accountUsers: null
        });
      }
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
        // let homeTextResults = await translator.translate(
        //   payload.homeText,
        //   options
        // );
        // const translatedHome = homeTextResults[0];

        socket.emit("homeTranslated", {});
      } else {
        socket.emit("homeTranslated", {});
      }
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
        returnedEmailLabelText: translatedEmailLabelText
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
        returnedEmailLabelText: payload.emailLabelText
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
        returnedEmailLabelText: translatedEmailLabelText
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
        returnedEmailLabelText: payload.emailLabelText
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
      socket.emit("loginTranslated", {
        returnedDescriptor: translatedDescriptor,
        returnedPasswordLabel: translatedPasswordLabel,
        returnedLoginText: translatedLogin,
        returnedGoBackText: translatedGoBack,
        returnedEmailLabelText: translatedEmailLabelText
      });
    } else {
      socket.emit("loginTranslated", {
        returnedDescriptor: payload.descriptorText,
        returnedPasswordLabel: payload.passwordLabelText,
        returnedLoginText: payload.loginText,
        returnedGoBackText: payload.goBackText,
        returnedEmailLabelText: payload.emailLabelText
      });
    }
  });

  socket.on("createUserAccount", async payload => {
    console.log("in back end");
    let newUser = await User.build();
    newUser.email = payload.email;
    // newUser.first_name = payload.firstName;
    // newUser.last_name = payload.lastName;
    newUser.password = payload.password;
    newUser.language = payload.language;
    newUser.has_account = true;
    // newUser.account_type = "user";
    await newUser.save();
    console.log("user saved");
    socket.emit("userAccountCreated", {
      createdUser: newUser
    });
  });

  socket.on("createAdvocateAccount", async payload => {
    console.log("in back end");
    let newAdvocate = await Advocate.build();
    newAdvocate.email = payload.email;
    newAdvocate.first_name = payload.firstName;
    newAdvocate.last_name = payload.lastName;
    newAdvocate.password = payload.password;
    newAdvocate.language = payload.language;
    // newAdvocate.account_type = "advocate";
    await newAdvocate.save();
    console.log("Advocate saved");
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
      console.log("logging advocate in");
      socket.emit("advocateLoggedIn", {
        advocateInfo: foundAdvocate
      });
    } else if (foundUser !== null && foundUser.authenticate(payload.password)) {
      console.log("logging user in");
      socket.emit("userLoggedIn", {
        userInfo: foundUser
      });
    }
  });
});

// // The text to translate
// const text =
//   "I prepared a long-term production forecasting application to deliver reliable information for business cycle.";
// // The target language
// const target = "sw";

// const options = {
//   to: target,
//   model: "nmt"
// };

// // Translates some text into Russian
// translator
//   .translate(text, options)
//   .then(results => {
//     console.log(results);
//     const translation = results[0];
//     console.log(results[1].data.translations[0].detectedSourceLanguage);
//     const sourceLanguage =
//       results[1].data.translations[0].detectedSourceLanguage;
//     console.log(`Text: ${text}`);
//     console.log(`Translation: ${translation}`);
//     console.log(`Source Language: ${sourceLanguage}`);

//     translator.translate(translation, sourceLanguage).then(langData => {
//       const original = langData[0];
//       const secondLanguage =
//         langData[1].data.translations[0].detectedSourceLanguage;
//       console.log(`Returned Text: ${original}`);
//       console.log(`Second Language: ${secondLanguage}`);
//     });
//   })
//   .catch(err => {
//     console.error("ERROR:", err);
//   });

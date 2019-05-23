const pry = require("pryjs");
const Advocate = require("./models/Advocate");
const User = require("./models/User");
const Bio = require("./models/Bio");
const EducationEntry = require("./models/EducationEntry");
const WorkEntry = require("./models/WorkEntry");

let eli = Advocate.build();
eli.first_name = "Eli";
eli.last_name = "Lauff";
eli.email = "eli.lauff@gmail.com";
eli.save();

eval(pry.it);

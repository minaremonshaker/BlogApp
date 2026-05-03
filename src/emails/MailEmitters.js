import EventEmitter from "node:events";
import activateAccountEmail from "../emails/ActivateAccountEmail.js";
import welcomeEmail from "../emails/WelcomeEmail.js";

const MailEmmiters = new EventEmitter();

MailEmmiters.on("register", async (user, subject) => {
  try {
    await welcomeEmail(user, subject);
  } catch (err) {
    throw err;
  }
});

MailEmmiters.on("activate", async (user, subject, activationLink) => {
  try {
    await activateAccountEmail(user, subject, activationLink);
  } catch (err) {
    throw err;
  }
});

export default MailEmmiters;

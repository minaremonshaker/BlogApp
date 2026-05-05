import EventEmitter from "node:events";
import activateAccountEmail from "../emails/ActivateAccountEmail.js";
import welcomeEmail from "../emails/WelcomeEmail.js";

const MailEmmiters = new EventEmitter();

MailEmmiters.on("register", async (user, subject) => {
  await welcomeEmail(user, subject);
});

MailEmmiters.on("activate", async (user, subject, activationLink) => {
  await activateAccountEmail(user, subject, activationLink);
});

export default MailEmmiters;

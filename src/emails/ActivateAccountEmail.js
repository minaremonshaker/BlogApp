import { transporter } from "../utils/mail.js";

import generateEmailTemplates from "../utils/generateEmailTemplates.js";

const ActivateAccountEmail = async (user, subject, activationLink) => {
  try {
    const htmlResult = await generateEmailTemplates("activateAccount.html", {
      name: user.first_name,
      activationLink,
    });
    const email = await transporter.sendMail({
      from: {
        name: "BlogApp",
        address: process.env.EMAIL_USER,
      },
      to: user.email,
      subject,
      html: htmlResult,
    });
    return email;
  } catch (err) {
    console.error("Error sending welcome email:", err);
    throw err;
  }
};

export default ActivateAccountEmail;

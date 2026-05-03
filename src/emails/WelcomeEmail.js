import { transporter } from "../utils/mail.js";

import generateEmailTemplates from "../utils/generateEmailTemplates.js";


const welcomeEmail = async (user, subject) => {
  try {
    const htmlResult = await generateEmailTemplates("welcome.html", {
      name: user.first_name,
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

export default welcomeEmail;

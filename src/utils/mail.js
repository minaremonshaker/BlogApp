import nodemailer from "nodemailer";


/**
 * The Nodemailer transporter instance.
 *
 * @type {nodemailer.Transporter}
 */
export let transporter = null;

/**
 * Configures and verifies a Nodemailer transporter.
 *
 * @return {Promise<nodemailer.Transporter>} The configured transporter.
 * @throws {Error} If the transporter configuration fails.
 */
export const MailServer = async () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.NODE_MAILER_HOST,
      port: process.env.NODE_MAILER_PORT,
      secure: process.env.NODE_MAILER_SECURE,
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });
    await transporter.verify();
    console.log("Mail transporter configured successfully");
    return transporter;
  } catch (err) {
    console.error("Mail transporter configuration failed:", err);
  }
};

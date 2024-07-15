import nodemailer from "nodemailer";

export const sendEmail = async (
  email: string,
  url: string,
  html: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: `"PlantKeeper" ${process.env.EMAIL}`,
      to: email,
      subject: "Confirm your account!",
      text: url,
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject();
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      resolve();
    });
  });
};

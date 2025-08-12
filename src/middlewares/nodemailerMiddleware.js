import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
});

export async function sendEmail({ to, affair, msjHTML }) {
  try {
    const info = await transporter.sendMail({
      from: `"Bambbistore" <${process.env.NODEMAILER_USER}>`,
      to: to,
      subject: affair,
      html: msjHTML
    });

    console.log("Correo enviado:", info.messageId);
    console.log('Info correo enviado', info)
    return true;
  } catch (error) {
    console.error("Error enviando correo:", error);
    return false;
  }
}

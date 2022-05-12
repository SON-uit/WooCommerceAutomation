const nodemailer = require('nodemailer');
const ejs = require('ejs');
module.exports = class Email {
  constructor(user, url , data) {
    this.to = user.email;
    this.userData = user;
    // luu y gui email tu dau
    this.url = url
    this.data = data
    this.from = process.env.EMAIL;
  }
  newTransporter() {
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      //service: 'gmail',
      auth: {
        user: process.env.MAILTRAP_USER ,//process.env.EMAIL, 
        pass: process.env.MAILTRAP_PASSWORD, //process.env.PASSWORD
      }
    });
  }
  //send the actual email
  async send(subject) {
    //1) Render HTML bases on view engine
    const html = await ejs.renderFile(
      `${__dirname}/../views/index.ejs`,
      {
        user: this.userData,
        subject,
        data: this.data,
        url: this.url
      }
    );
    //2 Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      //text: htmlToText.fromString(html),
    };
    //3) create a tranport and send email
    await this.newTransporter().sendMail(mailOptions);
  }

  async sendMail() {
    await this.send('Confirm Order');
  }
};
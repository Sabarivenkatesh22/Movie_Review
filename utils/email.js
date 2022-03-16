// const nodemailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");
const pug = require('pug');
const htmlToText = require('html-to-text');
const env = require('dotenv');
env.config();



module.exports = class Email {
  constructor(user, url) {
    this.to = "124003251@sastra.ac.in";
    this.firstName = user.firstname;
    this.url = url || null;
    this.from = `Sabari DCS_Demo <${process.env.EMAIL_FROM}>`;
    sgMail.setApiKey(
      process.env.SENDGRID_API_KEY
    );
  }

  

  // newTransport() {
  //   if (process.env.NODE_ENV === 'production') {
  //     // Sendgrid
  //     return nodemailer.createTransport({
  //       service: 'SendGrid',
  //       auth: {
  //         user: process.env.SENDGRID_USERNAME,
  //         pass: process.env.SENDGRID_PASSWORD
  //       }
  //     });
  //   }

  //   return nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     auth: {
  //       user: process.env.EMAIL_USERNAME,
  //       pass: process.env.EMAIL_PASSWORD
  //     }
  //   });
  // }

  // Send the actual email
   send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
  sgMail
  .send(mailOptions)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error.message);
  });
  }

   sendWelcome() {
     this.send('welcome', 'Welcome to Make My Show!');
  }
  sendChangedPasswordNotification() {
    this.send('passwordChanged', 'Did you reset your password?');
 }
//   sendsellerVerification() {
//     this.send('sellerVerification', 'Verification Link For Seller');
//  }

   sendPasswordReset() {
     this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

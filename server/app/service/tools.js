'use strict';
const { Service } = require('egg');
const nodemailer = require('nodemailer');

const userEmail = '13538984906@163.com';
const transporter = nodemailer.createTransport({
  service: '163',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'AJNTYKWSVIZEWOIT',
  },
});
class ToolsService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log('email error', error);
      return false;
    }
  }
}
module.exports = ToolsService;

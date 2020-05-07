'use strict';

const Controller = require('egg').Controller;
const svgCatcha = require('svg-captcha');

class UtilController extends Controller {
  async captcha() {
    const captcha = svgCatcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';

    console.log('captcha=>' + captcha.text);
    this.ctx.body = captcha.data;
  }
}

module.exports = UtilController;

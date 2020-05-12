'use strict';
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const BaseController = require('./base');

const HashSalt = ':kaikeba@good!@123';
const createRule = {
  email: { type: 'email' },
  captcha: { type: 'string' },
  nickname: { type: 'string' },
  password: { type: 'string' },
};
class UserController extends BaseController {


  async login() {
    const { ctx, app } = this;
    const { email, captcha, password, emailcode } = ctx.request.body;
    // 校验验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      this.error('验证码错误');
    }
    // 校验邮箱验证码
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证码错误');
    }
    // 校验用户名和密码
    const user = await ctx.model.User.findOne({
      email,
      password: md5(password + HashSalt),
    });
    if (!user) {
      return this.error('用户名或密码错误');
    }
    // 用户信息加密成token 返回
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, { expiresIn: '1h' });
    this.succse({ token, email, nickname: user.nickname });
  }
  async register() {
    const { ctx } = this;
    try {
      ctx.validate(createRule);
    } catch (e) {
      return this.error('参数校验失败', -1, e.errors);
    }
    const { email, password, captcha, nickname } = ctx.request.body;
    console.log({ email, password, captcha, nickname });
    // 校验验证码
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      this.error('验证码错误');
    }
    // 校验邮箱是否重复
    if (await this.checkEmail(email)) {
      this.error('邮箱重复啦');
    }
    const ret = await ctx.model.User.create({
      email,
      nickname,
      password: md5(password + HashSalt),
    });
    if (ret._id) {
      this.message('注册成功');
    }
  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }
  // eslint-disable-next-line no-empty-function
  async verify() {

  }
  async info() {
    const { ctx } = this;
    // 有的接口需要从token中获取数据，因为很多接口需要用到，所以弄个中间件
    const { email } = ctx.state;
    const user = await this.checkEmail(email);
    console.log('user', user);
    this.succse(user);
  }
}
module.exports = UserController;

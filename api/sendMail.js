const nodemailer = require('nodemailer');
const sanitizer = require('sanitize-html');
require('dotenv').config();

const from = `aleksey - ${process.env.EMAIL_ADRESS}`;
const toMail = `${process.env.EMAIL_ADRESS_TO}`;
const hostMail = `${process.env.MAIL_POST}`;
const transport = getTransporter();

async function formSubmit(formData) {
  const data = new Date();
  return sendMail({
    from,
    to: toMail,
    subject: 'New user',
    html: sanitizer(
      `<ul><li>${formData.email}</li><li>${formData.name}</li></ul><br>${data}`
    ),
  });
}

const history = new Map();
const rateLimit = (ip, limit = 3) => {
  if (history.get(ip) > limit) {
    throw "too many req";
  }
  history.set(ip, history.get(ip) + 1);
};

function getTransporter() {
  return nodemailer.createTransport({
    host: hostMail,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ADRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

async function sendMail(options) {
  try {
    await transport.sendMail(options);
    return { success: true };
  } catch (error) {
    throw new Error(error?.message ?? 'Send Error');
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      rateLimit(req.headers['x-real-ip'], 3);
    } catch (e) {
      return res.status(429).json({
        status: 429,
        message: 'too many req',
        error: true,
        result: {
          success: false,
        },
      });
    }
    return res.json({
      status: '200',
    });
  }
  if (req.method === 'POST') {
    try {
      rateLimit(req.headers['x-real-ip'], 3);
    } catch (e) {
      return res.status(429).json({
        status: 429,
        message: 'too many req',
        error: true,
        result: {
          success: false,
        },
      });
    }
    const { email, name, password, passwordConfirm } = req.body;
    if (name === '' || email === '' || password === '') {
      return res.status(403).json({
        error: true,
        message: 'Fields can`t be empty',
        result: {
          success: false,
        },
      });
    }
    if (password !== passwordConfirm) {
      return res.status(403).json({
        error: true,
        message: 'Passwords doesn`t match',
        result: {
          success: false,
        },
      });
    }
    try {
      const result = await formSubmit(req.body);
      return res.json({ result, error: false, message: '' });
    } catch {
      return res.status(502).json({
        error: true,
        message: 'Error',
        result: {
          success: false,
        },
      });
    }
  }
};

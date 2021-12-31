const nodemailer = require('nodemailer');
const sanitizer = require('sanitize-html');
require('dotenv').config();

const from = `aleksey - ${process.env.EMAIL_ADRESS}`;
const transport = getTransporter();

async function formSubmit(formData) {
  const data = new Date();
  return sendMail({
    from,
    to: `${process.env.EMAIL_ADRESS_TO}`,
    subject: 'New user',
    html: sanitizer(
      `<ul><li>${formData.email}</li><li>${formData.name}</li></ul><br>${data}`
    ),
  });
}

const history = new Map();
const rateLimit = (ip, limit = 3) => {
  if (history.get(ip) > limit) {
    throw new Error();
  }
  history.set(ip, history.get(ip) + 1);
};

function getTransporter() {
    return nodemailer.createTransport({
    host: `${process.env.MAIL_POST}`,
    port: 587,
    secure: false, // upgrade later with STARTTLS
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
    if (name === '') {
      return res.status(403).json({
        error: true,
        message: 'Name can`t be empty',
        result: {
          success: false,
        },
      });
    }
    if (email === '') {
      return res.status(403).json({
        error: true,
        message: 'Email can`t be empty',
        result: {
          success: false,
        },
      });
    }
    if (password === '') {
      return res.status(403).json({
        error: true,
        message: 'Password can`t be empty',
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
    const result = await formSubmit(req.body);
    return res.json({ result, error: false, message: '' });
  }
};

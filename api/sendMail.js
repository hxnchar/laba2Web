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

const rateLimit = (ip, limit) => {
  const count = history.get(ip) || 0;
  if (history.get(ip) > limit) {
    throw CustomError(429, 'too many req');
  }
  history.set(ip, count + 1);
};

const CustomError = (errorStatus, errorMessage) => {
  const err = new Error(errorMessage);
  err.status = errorStatus;
  return err;
};

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
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

const validate = body => {
  const { email, name, password, passwordConfirm } = body;
  if (!email) {
    throw CustomError(400, 'email required');
  }
  if (!name) {
    throw CustomError(400, 'name required');
  }
  if (!password) {
    throw CustomError(400, 'password required');
  }
  if (password !== passwordConfirm) {
    throw CustomError(400, 'password mismatch');
  }
};

module.exports = async (req, res) => {
  try {
    rateLimit(req.headers['x-real-ip'], 2);
    validate(req.body);
    const result = await formSubmit(req.body);
    res.json({ result });
  } catch (e) {
    return res.status(e.status).json({
      status: e.status,
      errors: [e.message],
      result: {
        success: false,
      },
    });
  }
};

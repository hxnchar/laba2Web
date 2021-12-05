const nodemailer = require('nodemailer');
const sanitizer = require('sanitize-html');
require('dotenv').config();

const from = `aleksey - ${process.env.EMAIL_ADDRESS}`;

async function formSubmit(formData) {
  const data = new Date();
  return sendMail({
    from: from,
    to: 'alekseyhonchar@gmail.com',
    subject: 'New user',
    html: sanitizer(
      `<ul><li>${formData.email}</li><li>${formData.name}</li></ul><br>${data}`
    ),
  });
}

const history = new Map();
const rateLimit = (ip, limit = 3) => {
  if (!history.has(ip)) {
    history.set(ip, 0);
  }
  if (history.get(ip) > limit) {
    throw new Error();
  }
  console.log('Ip: ', ip, '; Number of req before: ', history.get(ip));
  history.set(ip, history.get(ip) + 1);
  console.log('Ip: ', ip, '; Number of req after: ', history.get(ip));
};

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

async function sendMail(options) {
  try {
    const transport = getTransporter();
    await transport.sendMail(options);
    return { success: true };
  } catch (error) {
    throw new Error(error?.message ?? 'Send Error');
  }
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    return res.json({
      status: '200',
    });
  }
  
  if (req.method === 'POST') {
    try {
      rateLimit(req.headers['x-real-ip']);
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

const nodemailer = require('nodemailer');

const config = {
    host: 'smtp-mail.outlook.com',
    port: '587',
    secure: false,
    secureConnection: true,
    auth: {
        user: 'O@hotmail.com',
        pass: 'O'
    }
};

let mailTransport = nodemailer.createTransport(config);




module.exports = mailTransport;
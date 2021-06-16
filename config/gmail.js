const nodemailer = require('nodemailer');

const config = {
    service: 'Gmail',
    auth: {
        user: '@gmail.com',
        pass: ''
    }
};

let mailTransport = nodemailer.createTransport(config);




module.exports = mailTransport;
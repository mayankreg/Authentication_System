const nodemailer = require("nodemailer");

// defines how this communication will take place
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'mayank.mishra21ms@gmail.com',
        pass: 'vxxkhrfbavwavxfn'
    }
    // https://myaccount.google.com/apppasswords
});

module.exports = {
    transporter: transporter,
}
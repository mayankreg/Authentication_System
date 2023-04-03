const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newUser = (email) => {
    console.log('this is email to be sent', email);
    nodeMailer.transporter.sendMail({
       from: 'mayank.mishra21ms@gmail.com',
       to: email,
       subject: "logged in your account",
       html: '<h2>You Have logged in your account !</h2>',
    }, (err, info) => {
        if (err){   
            console.log('Error in sending mail', err);
            return;
        }
        return;
    });
}
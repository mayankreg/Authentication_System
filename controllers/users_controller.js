const User = require('../models/user');
const bcrypt = require("bcrypt");
const queue = require('../config/kue');
const userMailer = require("../mailers/sign_in_mailer");
const userMailerWorker = require("../workers/sign_in_email_worker");

module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('users_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
}

module.exports.update = async function (req, res) {

    if (req.user.id == req.params.id) {

        try {
            console.log(req);
            let user = await User.findById(req.params.id);
            console.log(req.body.old_password, user.password);
            let check = User.validPassword(req.body.old_password, user.password);

            console.log(check);

            if (check == false) {
                console.log("Your Old Password is Wrong");
                req.flash("error", "Your old Password is wrong");
                return res.redirect("back");
            }

            let password = User.generateHash(req.body.new_password);

            User.findByIdAndUpdate(req.params.id, { password: password, }, function (err, user) {
                if (err) {
                    console.log("There is an error in updating the password");
                }
            });

            req.flash("success", "Your Password is updated");
            console.log("password is updated");

            user.name = req.body.name;
            user.email = req.body.email;
            user.save();

            return res.redirect("back");


        } catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render sign up page
module.exports.signUp = function (request, response) {
    if (request.isAuthenticated()) {
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_up', {
        title: 'Codeial | Sign Up!'
    });
}

// render sign in page
module.exports.signIn = function (request, response) {
    if (request.isAuthenticated()) {
        return response.redirect('/users/profile');
    }

    return response.render('user_sign_in', {
        title: 'Codeial | Sign In!'
    });
}

// get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { req.flash('error', err); return }

        let password = User.generateHash(req.body.password);

        if (!user) {
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: password
            }, function (err, user) {
                if (err) { req.flash('error', err); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }

    });
}

// sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');

    // userMailer.newUser(req.body.email);
    // putting new above task in queue...which will be executed via worker one at a time
    queue.create('email_queue', req.body.email).save(function(err){
        if (err) {
            console.log('error in creating a queue');
        }
    });
    
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out!');
        return res.redirect('/');
    });
}
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const bcrypt = require("bcrypt");

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done){
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user)  {
            if (err){
                req.flash('error', err);
                return done(err);
            }
            

            if (!user){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            let check = User.validPassword(password, user.password);
            console.log(check);
            console.log(password, user.password);
            if(check == false){
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }

));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// de-serializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});

// check if user is authenticated
passport.checkAuthentication = function(request, response, next){
    if(request.isAuthenticated()){
        return next();
    }

    // if user is not signed in
    return response.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(request, response, next){
    if(request.isAuthenticated()){
        // request.user contains the current sign in user from the session cookie & we are just sending it to the locals for the views
        response.locals.user = request.user;
    }
    next();
};

module.exports = passport;
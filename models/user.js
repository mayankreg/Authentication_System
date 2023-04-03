const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true,
    },
},{
    timestamps: true
});

userSchema.statics.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
  };
  
userSchema.statics.validPassword = function (password, user) {
    return bcrypt.compareSync(password, user);
  };

const User = mongoose.model('User', userSchema);
module.exports = User;
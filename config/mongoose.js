const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/codeial_dev1');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'that is an error!'));

db.once('open', function(){
    console.log('sucessfully connected to database');
});

module.exports = db;
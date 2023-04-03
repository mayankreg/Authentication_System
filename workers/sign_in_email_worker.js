const queue = require('../config/kue');
const sign_in_mailer = require('../mailers/sign_in_mailer');

// this queue is maintained on redis server
// all workers have process function....whenever a new task is created...worker needs to execute code in process function
queue.process('email_queue', function(job, done){
    console.log('emails worker is processing a job ', job.data);

    sign_in_mailer.newUser(job.data);
    done();
});
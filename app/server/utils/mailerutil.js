'use strict';

var nodemailer = require('nodemailer');
var config = require('../config');

var transport = nodemailer.createTransport('SMTP', {
   service: config.mail.service,
   auth: {
     user: config.mail.user,
     pass: config.mail.pass
   }
});

exports.sendMail = function(from, to, subject, html) {
  transport.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  }, function(err, responseStatus) {
       if (err) {
         console.log("Error:" + err);
       } else {
         console.log("Sent mail");
       }
    });
};

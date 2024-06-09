const Nodemailer = require('nodemailer');


// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail({ email, code, message = "verify your email address"  } ) {

    let transporter = Nodemailer.createTransport({
        name: "www.banjnetdigital.com",  //www.agronigeria.ng
        host: "mail.banjnetdigital.com",  //mail.agronigeria.ng
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "noreply@banjnetdigital.com", //no-reply@agronigeria.ng
          pass: "Noreply.202317", //AgroNigA!!en90
        },
      });
    
    // setup e-mail data, even with unicode symbols
    var mailOptions = {
        from: 'noreply@banjnetdigital.com',
        to: `${email}`,
        subject: `Verify Email`,
        text: `Use this code to verify email ${code}`,
        html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
            <h3>Loose Therapy Application Onboarding Verification Code</h3>
            <p>A verification code is needed to continue the Onboarding process</p>
            
            <h1> ${code} </h1>

            <p> This code will expire in 30 minutes </p>
            <p style="line-height: 1.3rem;">
            Thanks <br />
            <em>The Loose Therapy App Team</em>
            </p>
        </div>
        `
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
    
        console.log('Message sent: ' + info.response);
    });

}

module.exports = sendEmail;
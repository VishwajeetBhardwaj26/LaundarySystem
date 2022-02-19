const nodeMailer = require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
            port:465,
            secure: true,
            secureConnection: false,
        auth:{
            user:'vishwajeetbhardwaj2612@gmail.com',
            pass:'Vishu@8081'
        },
        tls:{
            rejectUnAuthorized:true
        }
        
    });
    const mailOptions={
        from:'vishwajeetbhardwaj2612@gmail.com',
        to:options.email,
        subject:options.subject,
        text:options.message,
    };
    await transporter.sendMail(mailOptions);

};
module.exports= sendEmail;
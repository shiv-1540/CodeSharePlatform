const nodemailer = require('nodemailer');
require('dotenv').config();
const senderEmail = process.env.SENDER;
const senderPass = process.env.EMAIL_PASS;

function sendRoomCodeAndPassword(emailIDs, roomCode, password, title) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'amk.bhk@gmail.com',
                // user: 'shivghyar538@gmail.com',
                // pass: 'Shiv@Man03'
               pass: 'usqt mwhe uqed kuyl'
            }
        });
        const mailOptions = {
            from: senderEmail,
            to: emailIDs,
            subject: 'You’ve been invited to join a CodeShare Project Room!',
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  
                  <h2 style="color: #333333; text-align: center;">🚀 Welcome to <span style="color: #4f46e5;">CodeShare</span></h2>
                  
                  <p style="font-size: 16px; color: #555;">
                    You’ve been invited to join a collaborative coding session on <strong>CodeShare</strong>, the real-time multi-user code editor.
                  </p>
                  
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          
                  <h3 style="color: #333;">🔐 Project Room Details:</h3>
                  <ul style="font-size: 16px; color: #444;">
                    <li><strong>Project Title:</strong> ${title}</li>
                    <li><strong>Room Code:</strong> <code style="background: #eee; padding: 3px 6px; border-radius: 4px;">${roomCode}</code></li>
                    <li><strong>Password:</strong> <code style="background: #eee; padding: 3px 6px; border-radius: 4px;">${password}</code></li>
                  </ul>
          
                  <p style="margin-top: 20px; font-size: 16px;">
                    Click the button below to join the room and start coding together:
                  </p>
          
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/joinProject" 
                       style="background-color: #4f46e5; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                      Join Project Room
                    </a>
                  </div>
          
                  <p style="font-size: 14px; color: #999; text-align: center;">
                    If you did not expect this email, feel free to ignore it.
                  </p>
                </div>
              </div>
            `
          };
          

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                reject('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                resolve({ success: true });
            }
        });
    });
}



// Function to send deletion notifications to a list of email addresses
function sendDeletionNotifications(emailIDs) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: senderPass
            }
        });

        const mailOptions = {
            from: senderEmail,
            to: emailIDs,
            subject: 'Project Room Deleted',
            text: `
            We wanted to inform you that the project room you were part of has been deleted. 
            If you have any questions, please contact the project administrator.
            `
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                reject('Error sending deletion notification emails');
            } else {
                console.log('Deletion notification emails sent: ' + info.response);
                resolve({ success: true });
            }
        });
    });
}


module.exports = { sendRoomCodeAndPassword, sendDeletionNotifications };
const nodemailer = require("nodemailer");

let Emailer = function(app) {
    let emailer = {};

    /**
     * Sends a new email with the given subject and body to the given email
     * address.
     * @param {!string} to   the email address to send the email to
     * @param {!string} subject   the subject of the email
     * @param {!string} text   the body of the email
     * @returns {Promise<void>}
     */
    emailer.sendMail = async function(to, subject, text) {
        let transporter = app.get("transporter");

        let mailOptions = {
            from: "SillyTranslate",
            to: to,
            subject: subject,
            text: text
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: " + info.messageId
            + "   Preview URL: " + nodemailer.getTestMessageUrl(info));
    };

    return emailer;
};

module.exports = Emailer;

const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.send = ({ content }) => {
    return client.messages.create({
        body: content,
        from: process.env.TWILIO_PHONE,
        to: '+919999999999' // Replace with user number
    });
};
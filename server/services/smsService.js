const twilio = require('twilio');

let client;
try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        throw new Error('Twilio credentials not found in environment variables');
    }
    
    if (!process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
        throw new Error('Invalid Twilio Account SID format. Must start with AC');
    }
    
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('Twilio client initialized successfully');
} catch (error) {
    console.error('Error initializing Twilio client:', error.message);
    process.exit(1); // Exit if Twilio is not properly configured
}

exports.send = async ({ content, to }) => {
    if (!to) {
        throw new Error('Recipient phone number is required');
    }

    try {
        const message = await client.messages.create({
            body: content,
            from: process.env.TWILIO_PHONE,
            to: to
        });
        console.log('SMS sent successfully:', message.sid);
        return { 
            success: true, 
            messageId: message.sid,
            message: 'SMS sent successfully'
        };
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return { 
            success: false, 
            error: error.message 
        };
    }
};
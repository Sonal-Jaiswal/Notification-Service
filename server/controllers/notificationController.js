const { sendToQueue } = require('../queues/notificationQueue');

const sendNotification = async (req, res) => {
    try {
        const { userId, type, content, to } = req.body;
        
        if (!userId || !type || !content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['email', 'sms', 'in-app'].includes(type)) {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        // Validate recipient for SMS and email
        if ((type === 'sms' || type === 'email') && !to) {
            return res.status(400).json({ error: 'Recipient is required for SMS and email notifications' });
        }

        // Format phone number if it's an SMS
        let formattedRecipient = to;
        if (type === 'sms' && to && !to.startsWith('+')) {
            formattedRecipient = '+91' + to; // Assuming Indian numbers
        }

        await sendToQueue({ 
            userId, 
            type, 
            content, 
            to: formattedRecipient 
        });
        
        res.json({ 
            message: 'Notification queued successfully',
            recipient: formattedRecipient
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
};

const getUserNotifications = async (req, res) => {
    try {
        const { id } = req.params;
        // In a real application, you would fetch notifications from the database
        res.json([
            {
                userId: id,
                type: 'email',
                content: 'Sample notification',
                status: 'sent',
                createdAt: new Date()
            }
        ]);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

module.exports = {
    sendNotification,
    getUserNotifications
};
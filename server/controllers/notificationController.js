const Notification = require('../server/models/Notification');
const { publishToQueue } = require('../server/queues/notificationQueue');

exports.sendNotification = async (req, res) => {
    const { userId, type, content } = req.body;

    try {
        const notification = await Notification.create({ userId, type, content });
        await publishToQueue(notification);
        res.status(202).json({ message: "Notification queued" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.id });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
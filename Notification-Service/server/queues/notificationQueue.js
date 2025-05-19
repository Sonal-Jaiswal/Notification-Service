const amqp = require('amqplib');
const Notification = require('../models/Notification');
const dispatcher = require('../services/notificationDispatcher');

let channel;

const sendToQueue = async (notification) => {
    try {
        await channel.sendToQueue(
            'notifications',
            Buffer.from(JSON.stringify(notification)),
            { persistent: true }
        );
        console.log('Notification sent to queue:', notification);
    } catch (error) {
        console.error('Error sending to queue:', error);
        throw error;
    }
};

async function connectQueue() {
    const conn = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await conn.createChannel();
    await channel.assertQueue('notifications', { durable: true });
    console.log("Listening to queue...");

    channel.consume('notifications', async (msg) => {
        const notification = JSON.parse(msg.content.toString());
        try {
            await dispatcher.dispatch(notification);
            await Notification.findByIdAndUpdate(notification._id, { status: 'sent' });
        } catch (err) {
            console.error("Notification failed:", err.message);
            await Notification.findByIdAndUpdate(notification._id, { status: 'failed' });
        }
        channel.ack(msg);
    });
}

function publishToQueue(notification) {
    return channel.sendToQueue(
        'notifications',
        Buffer.from(JSON.stringify(notification)),
        { persistent: true }
    );
}

module.exports = {
    connectQueue,
    sendToQueue,
    publishToQueue
};
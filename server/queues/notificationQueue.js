const amqp = require('amqplib');
const Notification = require('../models/Notification');
const dispatcher = require('../services/notificationDispatcher');

const QUEUE_NAME = 'notifications';
let channel;

async function connectQueue() {
    const conn = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    console.log("Listening to queue...");

    channel.consume(QUEUE_NAME, async (msg) => {
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
    return channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(notification)));
}

module.exports = { connectQueue, publishToQueue };
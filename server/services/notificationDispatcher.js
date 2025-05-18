const emailService = require('./emailService');
const smsService = require('./smsService');
const { retry } = require('../utils/retryWrapper');

exports.dispatch = async (notification) => {
    const { type } = notification;

    if (type === 'email') {
        return retry(() => emailService.send(notification), 3);
    }
    if (type === 'sms') {
        return retry(() => smsService.send(notification), 3);
    }
    if (type === 'in-app') {
        return Promise.resolve(); // In-app already saved to DB
    }

    throw new Error('Unsupported type');
};
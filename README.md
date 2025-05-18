# Notification Service

## Overview

A production-ready Notification Service that enables sending notifications to users through **Email**, **SMS**, and **In-App** methods. This system is designed with scalability, reliability, and asynchronous processing in mind using **RabbitMQ**, **MongoDB**, and **Express.js**.

---

## Features

* **Send Notifications** (Email, SMS, In-App)
* **Retrieve User Notifications**
* **Queue-based Processing** using RabbitMQ
* **Retry Mechanism** for failed notifications
* **MongoDB Storage** for persistence
* Written in **Node.js** with **Express.js**

---

## Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB
* **Queue**: RabbitMQ
* **Email**: Nodemailer
* **SMS**: Twilio

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/notification-service.git
cd notification-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE=+1234567890
RABBITMQ_URI=amqp://localhost
```

> **Note**: Make sure RabbitMQ and MongoDB are running locally or use appropriate hosted services.

### 4. Start the Server

```bash
npm start
```

---

## API Endpoints

### POST `/api/notifications`

Send a new notification

**Request Body:**

```json
{
  "userId": "user123",
  "type": "email", // sms or in-app
  "content": "This is your notification."
}
```

**Response:**

```json
{
  "message": "Notification queued"
}
```

---

### GET `/api/users/:id/notifications`

Fetch all notifications for a specific user

**Response:**

```json
[
  {
    "userId": "user123",
    "type": "email",
    "content": "This is your notification.",
    "status": "sent",
    "createdAt": "2025-05-18T14:25:43.511Z"
  }
]
```

---

## Project Structure

```
notification-service/
├── controllers/
├── models/
├── queues/
├── routes/
├── services/
├── utils/
├── .env
├── server.js
├── config.js
├── README.md
```

---

## Retry Strategy

Failed notification deliveries are retried with exponential backoff (e.g., 1s, 2s, 4s). After the maximum number of retries (default: 3), the notification is marked as `failed` in the database.

---

## Assumptions & Notes

* Email and SMS recipients are currently hardcoded for demo purposes.
* In production, user contact details should be resolved from a user database.
* For security, sensitive keys should be stored in a secrets manager or encrypted store.

---

## To-Do / Future Enhancements

* Add real user contact resolution via auth service
* Add support for push notifications (Firebase / WebPush)
* Add WebSocket integration for real-time in-app notifications
* Add dashboard or frontend interface

---

## License

MIT License

---

## Contact

For any queries or contributions, feel free to contact \[[vsonaljaiswal@gmail.com](mailto:vsonaljaiswal@gmail.com)] or raise an issue on the repository.
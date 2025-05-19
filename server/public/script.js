async function sendNotification() {
    const type = document.getElementById('notificationType').value;
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('message').value;

    // Validate inputs
    if (!message) {
        showStatus('Please enter a message', 'error');
        return;
    }

    // Validate recipient for SMS and email
    if ((type === 'sms' || type === 'email') && !recipient) {
        showStatus(`Please enter a ${type === 'sms' ? 'phone number' : 'email address'}`, 'error');
        return;
    }

    // Validate email format if type is email
    if (type === 'email' && recipient) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipient)) {
            showStatus('Please enter a valid email address', 'error');
            return;
        }
    }

    // Validate phone number format if type is SMS
    if (type === 'sms' && recipient) {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(recipient.replace(/^\+91/, ''))) {
            showStatus('Please enter a valid phone number', 'error');
            return;
        }
    }

    try {
        const response = await fetch('/api/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 'user123',
                type: type,
                content: message,
                to: recipient
            })
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('Notification sent successfully!', 'success');
            addToNotificationsList(type, data.recipient || recipient, message);
            clearForm();
        } else {
            showStatus(`Error: ${data.error || 'Failed to send notification'}`, 'error');
        }
    } catch (error) {
        showStatus('Error sending notification: ' + error.message, 'error');
    }
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    
    // Clear status after 5 seconds
    setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
    }, 5000);
}

function addToNotificationsList(type, recipient, message) {
    const notificationsList = document.getElementById('notificationsList');
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    
    const timestamp = new Date().toLocaleString();
    notificationItem.innerHTML = `
        <strong>${type.toUpperCase()}</strong> to ${recipient}<br>
        <small>${timestamp}</small><br>
        ${message}
    `;
    
    notificationsList.insertBefore(notificationItem, notificationsList.firstChild);
}

function clearForm() {
    document.getElementById('message').value = '';
    // Don't clear recipient or type to allow sending multiple messages to the same recipient
} 
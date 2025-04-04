const nodemailer = require('nodemailer');
const Notification = require('../models/notifications');
const User = require('../../users/models/user');

// Send notification to users
const sendNotification = async (req, res) => {
  try {
    const { recipients, message } = req.body;
    // create notification
    const notification = new Notification({
      message,
      users: recipients,
    });
    await notification.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'freshfoodfarms@gmail.com', // this and password to be generated
        pass: 'yet to be generated',
      },
    });

    // Define email options
    const mailOptions = {
      from: 'freshfoodfarms@gmail.com',
      to: recipients.join(', '), // recipient emails separated by comma
      subject: 'New Notification from Fresh Food Farms',
      text: message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sending the notification.' });
  }
};

// Retrieve notification settings for users
const getNotificationSettings = async (req, res) => { // to be updated
};

// Update notification settings for a specific user
const updateNotificationSettings = async (req, res) => { // to be updated
};

module.exports = { sendNotification, getNotificationSettings, updateNotificationSettings };

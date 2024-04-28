const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const sgMail = require('@sendgrid/mail');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// const API_KEY = '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'; // Ensure to replace with your actual SendGrid API key
sgMail.setApiKey(API_KEY);

function readExcelData(filePath, sheetNumber = 0) {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[sheetNumber];
        const worksheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(worksheet);
    } catch (error) {
        console.error('Failed to read Excel file:', error);
        throw error;  // Rethrow the error to be caught in the endpoint
    }
}
const filePath = 'C:\\Users\\Minh\\Documents\\AggieHouse\\TestCalendar2024.xlsx';

app.get('/api/shifts', (req, res) => {
    try {
        const shifts = readExcelData(filePath, 0);
        console.log('Data read successfully:', shifts);
        res.json(shifts);
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).send('Error processing Excel file');
    }
});

app.post('/send-custom-reminders', (req, res) => {
    const { message, subject, recipients } = req.body;
    const contactInfo = readExcelData(filePath, 1); // 1 is typically the index for the second sheet
    
    let emailsToSend = [];

    if (recipients === 'all') {
        emailsToSend = contactInfo.map(item => item.email);  // Adjust 'email' if the column name is different
    } else {
        // For individual or selected emails, parse the recipients field
        emailsToSend = recipients.split(',').map(email => email.trim());
    }

    emailsToSend.forEach(email => {
        sendReminderEmail(email, subject, message);
    });

    res.send('Emails sent successfully');
});


function sendReminderEmail(to, subject, text) {
    const msg = {
        to: to,
        from:'aggiehouseschedules@gmail.com',  // This should be a verified sender
        subject: subject,
        text: text,
    };

    sgMail.send(msg)
        .then(() => console.log('Email sent successfully to', to))
        .catch((error) => console.error('Error sending email:', error));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

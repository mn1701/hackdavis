const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const sgMail = require('@sendgrid/mail');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = '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'; // Ensure to replace with your actual SendGrid API key
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

app.get('/api/shifts', (req, res) => {
    const filePath = 'C:\\Users\\Minh\\Documents\\AggieHouse\\TestCalendar2024.xlsx';
    try {
        const shifts = readExcelData(filePath, 0);
        console.log('Data read successfully:', shifts);
        res.json(shifts);
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).send('Error processing Excel file');
    }
});

const message = {
    to: 'mhanguyen@ucdavis.edu',
    from: 'aggiehouseschedules@gmail.com',
    subject: 'hello hello',
    text: 'hello',
    html: '<h1>Hello</h1>',
};

sgMail
    .send(message)
    .then((response) => console.log('emailsent'))
    .catch((error) => console.log(error.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

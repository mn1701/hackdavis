const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function readExcelData(filePath) {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(worksheet);
    } catch (error) {
        console.error('Failed to read Excel file:', error);
        throw error; // Rethrow the error to be caught in the endpoint
    }
}

app.get('/api/shifts', (req, res) => {
    const filePath = 'C:\\Users\\Minh\\Documents\\AggieHouse\\TestCalendar2024.xlsx'; // Updated file path
    try {
        console.log('Attempting to read Excel file from:', filePath);
        const shifts = readExcelData(filePath);
        console.log('Data read successfully:', shifts);
        res.json(shifts);
    } catch (error) {
        console.error('Error reading Excel file:', error);
        res.status(500).send('Error processing Excel file');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const twilio = require('twilio');
const cron = require('node-cron');
const XLSX = require('xlsx');
const fs = require('fs');
const { config } = require('dotenv');
require('dotenv').config();



const accountSid = process.env.TWILIO_ACCOUNT_SID ;
const authToken = process.env.TWILIO_AUTH_TOKEN ;
const client = new twilio(accountSid, authToken);


const whatsappFrom = process.env.WhatsAppFrom;


const app = express();
app.use(express.urlencoded({ extended: true }));


const fileName = 'WaterUsageData.xlsx';
let workbook;
if (fs.existsSync(fileName)) {
    workbook = XLSX.readFile(fileName);
} else {
    workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([['Date', 'Value']]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, fileName);
}

function appendToExcel(date, value) {
    const worksheet = workbook.Sheets['Data'];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    data.push([date, value]);
    const newWorksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets['Data'] = newWorksheet;
    XLSX.writeFile(workbook, fileName);
}


const targetNumbers = [
    'whatsapp:+919876543210',
    'whatsapp:+919812345678',

];

targetNumbers.forEach(targetNumber => {
    cron.schedule('*/5 * * * *', () => {
        client.messages.create({
            body: "Please send today's Water Usage Data.",
            from: whatsappFrom,
            to: targetNumber
        }).then(message => console.log(`Message sent to ${targetNumber} with SID: ${message.sid}`))
        .catch(err => console.error(err));
    });
});


app.post('/whatsapp', (req, res) => {
    console.log(req.body);  
    const incomingMessage = req.body.Body.trim();
    const from = req.body.From;


    const waterUsage = parseInt(incomingMessage);
    if (!isNaN(waterUsage)) {
        const date = new Date().toISOString().split('T')[0];
        appendToExcel(date, `${waterUsage} liters`);

        client.messages.create({
            body: `Thank you! You've recorded ${waterUsage} liters of water usage for today.`,
            from: whatsappFrom,
            to: from
        }).then(message => console.log(`Confirmation sent with SID: ${message.sid}`))
        .catch(err => console.error(err));
    } else {
        client.messages.create({
            body: `Please enter a valid number for water usage.`,
            from: whatsappFrom,
            to: from
        }).then(message => console.log(`Error message sent with SID: ${message.sid}`))
        .catch(err => console.error(err));
    }

    res.sendStatus(200);
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

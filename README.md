# WhatsApp Water Usage Bot

This project is a Node.js application that collects water usage data from users via WhatsApp and stores the data in an Excel file. The bot sends periodic reminders to users to submit their water usage data, which is then logged in an Excel spreadsheet.

## Features

- Sends periodic reminders via WhatsApp to users to input their water usage data.
- Collects and stores the data in an Excel file (`WaterUsageData.xlsx`).
- Validates the user's input to ensure it is a number representing liters of water used.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your local machine.
- A Twilio account with WhatsApp sandbox set up.
- A `.env` file with your Twilio credentials.

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/whatsapp-water-usage-bot.git
    cd whatsapp-water-usage-bot
    ```

2. **Install the dependencies**:

    ```bash
    npm install
    ```

3. **Set up your environment variables**:

    Create a `.env` file in the root directory of the project with the following variables:

    ```plaintext
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    WhatsAppFrom=whatsapp:+14155238886  # Replace with your Twilio WhatsApp number
    ```

4. **Run the application**:

    ```bash
    node index.js
    ```

## Usage

1. **Expose your local server to the internet**:

    Use a tool like Ngrok to expose your local server:

    ```bash
    ngrok http 3000
    ```

    Copy the forwarding URL provided by Ngrok (e.g., `https://abcd1234.ngrok.io`).

2. **Set up Twilio webhook**:

    Go to your [Twilio Console](https://www.twilio.com/console) and update the WhatsApp sandbox settings to use the Ngrok URL for incoming messages:

    - **WHEN A MESSAGE COMES IN**: `https://abcd1234.ngrok.io/whatsapp`

3. **Add target phone numbers**:

    Update the `targetNumbers` array in `index.js` with the WhatsApp numbers you want to send reminders to.

4. **Test the bot**:

    The bot will automatically start sending reminders every 5 minutes to the specified numbers. Users can reply with their water usage data (e.g., `500` for 500 liters), and the bot will store this information in the Excel file.

## Project Structure

- `index.js`: The main application file containing the bot's logic.
- `WaterUsageData.xlsx`: The Excel file where water usage data is stored.
- `.env`: The environment variables file (not included in the repository).

## Dependencies

- `express`: Web framework for Node.js.
- `twilio`: Twilio Node.js SDK for sending and receiving WhatsApp messages.
- `node-cron`: Scheduler for sending periodic reminders.
- `xlsx`: Library for reading and writing Excel files.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.




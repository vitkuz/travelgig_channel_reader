import {TelegramClient} from 'telegram';
import {StringSession} from 'telegram/sessions/index.js';
// @ts-ignore
import input from 'input'; // Install with `npm install input`

const session = process.env.SESSION!; // Replace with your API ID
const apiId = process.env.APP_ID!; // Replace with your API ID
const apiHash = process.env.API_HASH!; // Replace with your API hash

const generateSession = async () => {
    const client = new TelegramClient(new StringSession(session), Number(apiId), apiHash, {
        connectionRetries: 5,
    });

    console.log('Connecting...');
    await client.start({
        phoneNumber: async () => await input.text('Please enter your phone number: '),
        password: async () => await input.text('Please enter your password: '),
        phoneCode: async () => await input.text('Please enter the code sent to your Telegram: '),
        onError: (err) => console.error(err),
    });

    console.log('Connected!');

    console.log('Your session string:', client.session.save());
    await client.disconnect();
};

generateSession();

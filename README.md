## About

[Discord.js-transcript](https://github.com/SrWhale/discord.js-transcript) is a powerful [Node.js](https://nodejs.org) module that allows you to easily play games in the discord using [Discord.js](https://github.com/discordjs/discord.js) module.
Using the [Discord API](https://discord.com/developers/docs/intro).

## Installation

**Node.js 16.9.0 or newer is required.**

```sh-session
npm install discord.js-transcript
yarn add discord.js-transcript
pnpm add discord.js-transcript
```

## Easily example usage (model used for all games)

```js
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const { UserTranscript } = require('discord.js-transcript');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
	 const transcript = new UserTranscript({
        client: client,
        channel: client.channels.cache.get("ID"),
        member: client.guilds.cache.get("ID")?.members.cache.get("ID"),
        credentials: {
            accessKeyId: "AWS_ACCESS_KEY",
            secretAccessKey: "AWS_SECRET_ACCESS_KEY",
        }
    })

    transcript.start();

    // transcript.stop(true); // stop recording and transcript and leave voice channel

    transcript.on("data", (data) => {
        console.log(`MESSAGE STATUS: ${data}`)
    })
        .on('end', () => {
            console.log("Transcript Finished!")
        })
});

client.login('token');
```

## Links

- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js)
- [npm](https://www.npmjs.com/package/discord.js-transcript)
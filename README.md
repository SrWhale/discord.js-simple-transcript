## About

[discord.js-simple-transcript](https://github.com/SrWhale/discord.js-simple-transcript) is a powerful [Node.js](https://nodejs.org) module that allows you to easily play games in the discord using [Discord.js](https://github.com/discordjs/discord.js) module.
Using the [Discord API](https://discord.com/developers/docs/intro).

## Installation

**Node.js 16.9.0 or newer is required.**

```sh-session
npm install discord.js-simple-transcript
yarn add discord.js-simple-transcript
pnpm add discord.js-simple-transcript
```

## AWS Credentials required to use that module

**Aws Credentials are required to use that module.**

You can get it here: [AWS Console](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-east-1#/security_credentials)

Also, you need to enable AWS Transcript to have access to Amazon Transcribe. You can do this here: [AWS Transcribe](https://us-east-1.console.aws.amazon.com/transcribe/)

## Easily example usage (model used for all games)

```js
const { UserTranscript } = require('discord.js-simple-transcript');

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMembers]
});

client.login(process.env.TOKEN);

client.on('ready', () => {
    const transcript = new UserTranscript({
        client: client,
        channel: client.channels.cache.get("VOICE_CHANNEL_ID"),
        member: client.guilds.cache.get("GUILD_ID")?.members.cache.get("MEMBER_ID"),
        credentials: {
            accessKeyId: "ACCESS_KEY",
            secretAccessKey: "SECRET_ACCESS_KEY"
        }
    })

    transcript.start();

    // transcript.stop(true); // stop recording and transcript and leave voice channel

    transcript.on("data", (data) => {
        console.log(`MESSAGE STATUS: ${data}`)
    })
    
    .on('end', () => {
            console.log("END")
    })
})

```

## Links

- [Discord API Discord server](https://discord.gg/discord-api)
- [GitHub](https://github.com/discordjs/discord.js)
- [npm](https://www.npmjs.com/package/discord.js-simple-transcript)
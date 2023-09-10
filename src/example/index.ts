import { Client, IntentsBitField, VoiceChannel, GuildMember } from 'discord.js';

import { UserTranscript } from '../DiscordModule';

import "dotenv/config";

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMembers]
});

client.login(process.env.TOKEN);

client.on('ready', () => {
    const transcript = new UserTranscript({
        client: client,
        channel: client.channels.cache.get("690201054033346731") as VoiceChannel,
        member: client.guilds.cache.get("690201054029152270")?.members.cache.get("624997146453737472") as GuildMember,
        credentials: {
            accessKeyId: process.env.KEY as string,
            secretAccessKey: process.env.SECRET_KEY as string,
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
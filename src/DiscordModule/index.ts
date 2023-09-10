import { Client, GuildMember, VoiceChannel } from "discord.js";
import { ChannelTranscriptOptions } from "../types/DiscordModule";

import { opus } from 'prism-media'

import { AudioReceiveStream, VoiceConnection, joinVoiceChannel } from '@discordjs/voice';

import { Transcript } from "../Transcript";

import { Credentials } from "../types/Transcript";

import { EventEmitter } from "events";

export class UserTranscript extends EventEmitter {
    client: Client;

    channel: VoiceChannel;

    member: GuildMember;

    credentials: Credentials;

    connection?: VoiceConnection;

    stream?: AudioReceiveStream

    constructor(options: ChannelTranscriptOptions) {
        super();

        this.client = options.client;
        this.channel = options.channel;

        this.member = options.member;

        this.credentials = options.credentials;
    }

    stop(leave = false): void {
        this.stream?.destroy();

        if (leave) {
            this.connection?.destroy();
        }
    }
    async start(): Promise<void> {
        if (!this.channel) throw new Error("Channel not found");

        if (!this.member) throw new Error("Member not found or not in client cache");

        if (!this.credentials) throw new Error("Credentials not found");

        if (!this.channel.joinable) throw new Error("Channel not joinable");

        if (!this.member.voice.channel) throw new Error("Member not in voice channel");

        this.connection = joinVoiceChannel({
            channelId: this.channel.id,
            guildId: this.channel.guild.id,
            adapterCreator: this.channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });

        const stream = this.connection.receiver.subscribe(this.member.id, {
            end: {
                behavior: 0,
            },
            emitClose: true,
            objectMode: false,
        });

        this.stream = stream;

        const encoded = new opus.Decoder({
            channels: 1,
            rate: 48000,
            frameSize: 1024
        });

        stream.pipe(encoded);

        const transcript = new Transcript(this.credentials);

        transcript
            .sendStream(encoded);

        transcript
            .on('data', (data) => {
                this.emit("data", data)
            })

            .on("end", () => {
                this.emit("end")
            })
    }
}
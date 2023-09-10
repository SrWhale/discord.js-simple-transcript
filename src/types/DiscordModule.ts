import { Client, GuildMember, VoiceChannel } from "discord.js";
import { Credentials } from "./Transcript";

export interface ChannelTranscriptOptions {
    client: Client;

    channel: VoiceChannel;

    member: GuildMember;

    credentials: Credentials;
}
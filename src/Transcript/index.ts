import {
    TranscribeStreamingClient,
    StartStreamTranscriptionCommand,
    TranscriptEvent,
    TranscriptResultStream,
    Result,
    Alternative,
    Item,
    StartStreamTranscriptionResponse,
} from "@aws-sdk/client-transcribe-streaming";

import all from "@aws-sdk/client-transcribe-streaming";

import { Credentials } from "../types/Transcript";

import { EventEmitter } from "events";

import { PassThrough } from "stream";

export class Transcript extends EventEmitter {
    client: TranscribeStreamingClient;

    constructor(options: Credentials) {
        super();

        this.client = new TranscribeStreamingClient({
            region: "us-east-1",
            credentials: options
        })
    }
    async sendStream(stream: any): Promise<void> {
        const audioPayloadStream = new PassThrough({
            highWaterMark: 1024 * 1,
        });

        stream.pipe(audioPayloadStream);

        const audioStream = async function* () {
            for await (const payloadChunk of audioPayloadStream) {
                yield { AudioEvent: { AudioChunk: payloadChunk } };
            }
        };
        const command = new StartStreamTranscriptionCommand({
            LanguageCode: "pt-BR",
            MediaEncoding: "pcm",
            MediaSampleRateHertz: 48000,
            AudioStream: audioStream(),
        });

        const response = await this.client.send(command) as StartStreamTranscriptionResponse

        for await (const event of response.TranscriptResultStream as AsyncIterable<TranscriptResultStream>) {
            if (event.TranscriptEvent) {
                const message = event.TranscriptEvent as TranscriptEvent;

                const transcript = event.TranscriptEvent.Transcript as all.Transcript;

                const results = transcript.Results as Result[];

                results.map((result: Result) => {
                    (result.Alternatives || []).map((alternative: Alternative) => {
                        const transcript = (alternative.Items as Array<Item>).map((item: Item) => item.Content).join(" ");
                        this.emit('data', transcript)
                    });
                });
            }
        };

        this.emit('end', null);
    }
}
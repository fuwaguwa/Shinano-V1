import { TextChannel } from "discord.js";
import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2'
import { client } from "..";
import { sleep } from "./Utils";
import News from '../schemas/ALNews'
import { config } from "dotenv";
import { lastTweetId } from '../../lastTweet.json'
import path from "path";
import fs from 'fs'
config()

async function listenForever(streamFactory, dataConsumer) {
    try {
        console.log("Connected to Twitter stream!")
        for await (const { data } of streamFactory()) {
            dataConsumer(data);
        }

        console.log('Stream disconnected healthily. Reconnecting.');
        listenForever(streamFactory, dataConsumer);
    } catch (error) {
        console.warn('Stream disconnected with error. Retrying.', error);
        listenForever(streamFactory, dataConsumer);
    }
}


async function postTweet(tweet) {
    if (`${tweet.data.conversation_id}` === lastTweetId) return
    if (!['993682160744738816', '864400939125415936'].includes(`${tweet.data.author_id}`)) return;

    fs.writeFileSync(path.join(__dirname, "..", "..", "lastTweet.json"), JSON.stringify({
        "lastTweetId": `${tweet.data.conversation_id}`
    }, null, "\t"))

    const iterations: number = 0;
    for await (const doc of News.find()) {
        if (iterations == 40) sleep(1000);
        
        try {
            const guild = await client.guilds.fetch(doc.guildId)
            const channel = await guild.channels.fetch(doc.channelId)

            const link: string = `https://twitter.com/${tweet.data.author_id}/status/${tweet.data.conversation_id}`
            let server: string

            link.includes("993682160744738816") ? server = 'EN' : server = 'JP'

            await (channel as TextChannel).send({
                content:
                `__Shikikans, there's a new message from ${server} HQ!__\n` +
                link
            })
        } catch (error) {
            console.warn(error)
            continue
        }
    }
}

export async function startTweetListener() {
    const twitClient = new TwitterApi(process.env.twitterBearerToken)
    const stream = await twitClient.v2.searchStream({
        'tweet.fields': ['author_id', 'conversation_id'],
        'expansions': ['author_id', 'referenced_tweets.id'],
        'media.fields': ['url'],
    })

    stream.autoReconnect = true

    stream.on(ETwitterStreamEvent.ConnectionError, (err) => {console.log('Twitter: Connection Error', err)})
    stream.on(ETwitterStreamEvent.ConnectionClosed, () => {console.log("Twitter: Connection Closed")})
    stream.on(ETwitterStreamEvent.Reconnected, () => {console.log("Twitter: Reconnected to stream")})
    stream.on(ETwitterStreamEvent.ReconnectAttempt, (tries) => {console.log(`Twitter: Reconnection Attempt#${tries}`)})
    stream.on(ETwitterStreamEvent.ReconnectError, (err) => {console.log("Twitter: Reconnect Error", err)})

    stream.on(ETwitterStreamEvent.Data, postTweet)
}
import { TextChannel } from "discord.js";
import Twitter from "twitter-v2";
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
    if (`${tweet.conversation_id}` === lastTweetId) return
    if (!['993682160744738816', '864400939125415936'].includes(`${tweet.author_id}`)) return;

    fs.writeFileSync(path.join(__dirname, "..", "..", "lastTweet.json"), JSON.stringify({
        "lastTweetId": `${tweet.conversation_id}`
    }, null, "\t"))

    const iterations: number = 0;
    for await (const doc of News.find()) {
        if (iterations == 40) sleep(1000);
        
        try {
            const guild = await client.guilds.fetch(doc.guildId)
            const channel = await guild.channels.fetch(doc.channelId)

            const link: string = `https://twitter.com/${tweet.author_id}/status/${tweet.conversation_id}`
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
    const twitterClient = new Twitter({bearer_token: process.env.twitterBearerToken})
    const endpointParams = {
        'tweet.fields': [ 'author_id', 'conversation_id' ],
        'expansions': [ 'author_id', 'referenced_tweets.id' ],
        'media.fields': [ 'url' ]
    }

    const stream = twitterClient.stream('tweets/search/stream', endpointParams)
    
    await listenForever(
        () => stream,
        postTweet,
    )
}
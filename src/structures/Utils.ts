import { Guild, VoiceChannel } from "discord.js";
import fetch from 'node-fetch'
import { client } from '..'

export function isImage(url) {
    return(url.match(/^http[^\?]*.(jpg|jpeg|png)(\?(.*))?$/gmi) != null);
}

export function isImageAndGif(url) {
    return(url.match(/^http[^\?]*.(jpg|jpeg|png|gif)(\?(.*))?$/gmi) != null);
}

export function toTitleCase(str: string) {
    return str.toLowerCase().split(' ').map((word) => {
        return (word.charAt(0).toUpperCase() + word.slice(1))
    }).join(' ');
}

export function msToHmsFormat(duration) {
    let seconds:string | number = Math.floor((duration / 1000) % 60)
    let minutes:string | number = Math.floor((duration / (1000 * 60)) % 60)
    let hours:string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
}

export function isNum(value) {
    return !isNaN(value)
}

export function randStr() {
    let newName = "";
    const string = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
    for (let i = 0; i < 6; i++)
        newName += string.charAt(Math.floor(Math.random() * string.length));
    return newName;
}

export function strFormat(str: string, obj: []) {
    return str.replace(/\{\s*([^}\s]+)\s*\}/g, (m, p1, offset, string) => {
        return obj[p1]
    })
}

export async function updateServerCount() {
    if (client.user.id === '1002189046619045908') return 'Not Main Bot'
    // On Discord Services
    await fetch(`https://api.discordservices.net/bot/1002193298229829682/stats`, {
        method: "POST",
        headers: {
            "Authorization": process.env.discordServicesApiKey
        },
        body: JSON.stringify({
            "servers": client.guilds.cache.size
        })
    })

    // On Top.gg
    await fetch(`https://top.gg/api/bots/1002193298229829682/stats`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": process.env.topggApiKey
        },
        body: JSON.stringify({
            "server_count": client.guilds.cache.size
        })
    })


    // On Logging Server
    const guild: Guild = await client.guilds.fetch('1002188088942022807')
    const channel = (await guild.channels.fetch('1017460364658610306')) as VoiceChannel

    channel.setName(`Server Count: ${client.guilds.cache.size}`)
}

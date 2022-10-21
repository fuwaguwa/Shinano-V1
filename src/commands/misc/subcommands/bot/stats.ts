import { MessageEmbed } from "discord.js";
import { client } from "../../../..";
import { ShinanoInteraction } from "../../../../typings/Command";
import { config } from "dotenv";
import fetch from 'node-fetch'
config()

export async function botStats(interaction: ShinanoInteraction) {
    await interaction.deferReply()
    // Getting top.gg stats
    const response = await fetch('https://top.gg/api/bots/1002193298229829682', {
        method: "GET",
        headers: {
            "Authorization": process.env.topggApiKey
        }
    })
    const topggStats = await response.json()

    // Uptime
    let totalSeconds = (client.uptime / 1000);
    totalSeconds %= 86400

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);



    // Outputting Data
    const performance: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Shinano\'s Stats')
        .addFields(
            {
                name: 'Uptime:', 
                value: `${hours} hours, ${minutes} minutes, ${seconds} seconds`
            },
            {
                name: 'Latency:', 
                value: `Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`
            },
            {
                name: 'Bot Stats:', 
                value:
                `Total Guilds: ${client.guilds.cache.size}\n` +
                `Total Top.gg Votes: ${topggStats.points}\n` +
                `Monthly Top.gg Votes: ${topggStats.monthlyPoints}\n`
            }
        )
    await interaction.editReply({embeds: [performance]})
}
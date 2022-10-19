import { MessageEmbed } from "discord.js";
import { client } from "../../..";
import { ShinanoInteraction } from "../../../typings/Command";

export async function botStats(interaction: ShinanoInteraction) {
    await interaction.deferReply()
    let totalSeconds = (client.uptime / 1000);
    totalSeconds %= 86400

    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);


    let memberCount = client.users.cache.size


    const performance: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Shinano\'s Stats')
        .addFields(
            {name: 'Uptime:', value: `${hours} hours, ${minutes} minutes, ${seconds} seconds`},
            {name: 'Latency:', value: `Latency: ${Date.now() - interaction.createdTimestamp}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`},
            {name: 'Bot Stats:', value: `Guilds: ${client.guilds.cache.size}`}
        )
    await interaction.editReply({embeds: [performance]})
}
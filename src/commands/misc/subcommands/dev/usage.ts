import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";
import os from 'os'

export async function devUsage(interaction: ShinanoInteraction) {
    const memory = process.memoryUsage()
    const performance: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Memory Stats')
        .addFields(
            {name: 'Memory Usage:', value: 
            `RSS: ${(memory.rss / 1024**2).toFixed(2)}MB\n` +
            `External: ${(memory.external / 1024**2).toFixed(2)}MB\n` +
            `Heap Total Used: ${(memory.heapUsed / 1024**2).toFixed(2)}MB\n` +
            `Heap Total Mem: ${(memory.heapTotal / 1024**2).toFixed(2)}MB`},
            {name: 'Server Information:', value: 
            `Free Mem: ${(os.freemem() / 1024**2).toFixed(2)}MB\n` +
            `Total Mem: ${(os.totalmem() / 1024**2).toFixed(2)}MB`}
        )
    await interaction.editReply({embeds: [performance]})
}
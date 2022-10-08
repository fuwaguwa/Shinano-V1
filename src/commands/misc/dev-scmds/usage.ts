import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../typings/Command";

export async function devUsage(interaction: ShinanoInteraction) {
    const memory = process.memoryUsage()
    const performance: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Stats')
        .addFields(
            {name: 'Node', value: `
            RSS: **${(memory.rss / 1024**2).toFixed(2)} MB**
            External: **${(memory.external / 1024**2).toFixed(2)} MB**
            Heap Total Mem: **${(memory.heapTotal / 1024**2).toFixed(2)} MB**
            Heap Total Used: **${(memory.heapUsed / 1024**2).toFixed(2)} MB**`}
        )
    await interaction.editReply({embeds: [performance]})
}
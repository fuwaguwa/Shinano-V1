import { MessageEmbed } from "discord.js";
import { client } from "../../..";
import { ShinanoInteraction } from "../../../typings/Command";

export async function devGuildCount(interaction: ShinanoInteraction) {
    const guild: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setDescription(`Shinano is currently in ${client.guilds.cache.size} guilds/servers`)
    await interaction.editReply({
        embeds: [guild]
    })
}
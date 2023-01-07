import { MessageEmbed } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function shinanoPat(interaction: ShinanoInteraction) {
    const headpat: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setDescription(
            ['"Aah... My ears are sensitive..."', '"Alas... This one\'s ears are sensitive..."']
            [Math.floor(Math.random() * 2)]
        )
        .setImage('https://cdn.discordapp.com/attachments/1002189321631187026/1034474955116662844/shinano_azur_lane_drawn_by_nagi_ria__3c37724853c358bebf5bc5668e0d4314_1.gif')
    await interaction.reply({embeds: [headpat]})
}
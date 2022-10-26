import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'shinano-pat',
    description: 'Give Shinano a headpat!',
    cooldown: 3000,
    run: async({interaction}) => {
        const headpat: MessageEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription('"Aah... My ears are sensitive..."')
            .setImage('https://cdn.discordapp.com/attachments/1002189321631187026/1034474955116662844/shinano_azur_lane_drawn_by_nagi_ria__3c37724853c358bebf5bc5668e0d4314_1.gif')
        await interaction.reply({embeds: [headpat]})
    }
})
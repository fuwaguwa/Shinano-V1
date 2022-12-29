import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'catgirl',
    description: 'Generate a SFW catgirl pic.',
    cooldown: 4500,
    category: 'Image',
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch('https://waifu.pics/api/sfw/neko', {method: "GET"})
        const nekoPic = await response.json()

        const nekoEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setImage(nekoPic.url as string)

        await interaction.editReply({embeds: [nekoEmbed]})
    }
})
import { Command } from "../../structures/Command";
import fetch from 'node-fetch'
import { MessageEmbed } from "discord.js";

export default new Command({
    name: 'nekomimi',
    description: 'Generate a picture of a catgirl (SFW)',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()
        const response = await fetch('https://waifu.pics/api/sfw/neko', {method: "GET"})
        const nekoPic = await response.json()

        const neko: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setImage(nekoPic.url as string)
        await interaction.editReply({embeds: [neko]})
    }
})
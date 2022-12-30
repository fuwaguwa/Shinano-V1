import { Command } from '../../structures/Command'
import fetch from 'node-fetch'
import { MessageEmbed } from 'discord.js'

export default new Command({
    name: 'waifu',
    description: 'Looking for waifus?',
    cooldown:  4500,
    run: async({interaction}) => {
        await interaction.deferReply()

        const response = await fetch('https://nekos.best/api/v2/waifu')
        const waifu = await response.json()

        const waifuEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setImage(waifu.results[0].url)

        await interaction.editReply({embeds: [waifuEmbed]})
    }
})
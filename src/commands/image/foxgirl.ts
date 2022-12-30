import { MessageEmbed } from 'discord.js'
import { Command } from '../../structures/Command'
import fetch from 'node-fetch'

export default new Command({
    name: 'foxgirl',
    description: 'If you love me, you\'ll love them too (SFW)',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()

        const response = await fetch('https://nekos.best/api/v2/kitsune')
        const kitsunePic = await response.json()

        const foxgirlEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setImage(kitsunePic.results[0].url)

        await interaction.editReply({embeds: [foxgirlEmbed]})
    }
})
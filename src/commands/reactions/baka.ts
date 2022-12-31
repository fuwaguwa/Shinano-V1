import { MessageEmbed } from 'discord.js'
import { Command } from '../../structures/Command'
import neko from 'nekos-fun'

export default new Command({
    name: 'baka',
    description: 'Y-You idiot!',
    cooldown: 4500,
    category: 'Reactions',
    run: async({interaction}) => {
        await interaction.deferReply()

        const bakaEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setImage(await neko.sfw.baka())
        
        await interaction.editReply({embeds: [bakaEmbed]})
    }
})
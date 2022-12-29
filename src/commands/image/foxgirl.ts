import { MessageEmbed } from 'discord.js'
import neko from 'nekos-fun'
import { Command } from '../../structures/Command'

export default new Command({
    name: 'foxgirl',
    description: 'If you love me, you\'ll love them too (SFW)',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()

        const foxgirlEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setImage(await neko.sfw.foxGirl())

        await interaction.editReply({embeds: [foxgirlEmbed]})
    }
})
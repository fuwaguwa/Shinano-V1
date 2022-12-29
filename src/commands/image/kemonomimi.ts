import { Command } from '../../structures/Command'
import neko from 'nekos-fun'
import { MessageEmbed } from 'discord.js'

export default new Command({
    name: 'kemonomimi',
    description: 'Girls with animal features (SFW)',
    cooldown: 4500,
    run: async({interaction}) => {
        await interaction.deferReply()

        const kemonomimiEmbed: MessageEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setFooter({text:`Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic:true})})
            .setTimestamp()
            .setImage(await neko.sfw.animalEars())

        await interaction.editReply({embeds: [kemonomimiEmbed]})
    }
})
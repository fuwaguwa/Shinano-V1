import { Command } from '../../structures/Command'
import rFetch from 'reddit-fetch'
import { MessageEmbed } from 'discord.js'

export default new Command({
    name: 'two-sentence-horror',
    description: 'A two sentences story. Could be horrifying, cringe or funny.',
    category: 'Fun',
    cooldown: 5000,
    run: async({interaction}) => {
        await interaction.deferReply()

        const post = await rFetch({
            subreddit: 'TwoSentenceHorror',
            sort: 'hot',
            allowNSFW: false,
            allowModePost: false,
            allowCrossPost: false,
            allowVideo: false
        })

        const postEmbed: MessageEmbed = new MessageEmbed()  
            .setColor('#2f3136')
            .setDescription(`**${post.title}**\n${post.selftext}`)
        
        await interaction.editReply({embeds: [postEmbed]})
    }
})
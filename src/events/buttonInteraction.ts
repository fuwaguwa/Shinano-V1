import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Event } from "../structures/Event";
import User from '../schemas/User'


export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;


    switch (interaction.customId) {
        case 'NONSFW': {
            const cantSee: MessageEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setTitle('Enabling The NSFW Commands')
                .addFields(
                    {
                        name: 'For Normal Members',
                        value: 'Shinano\'s `/nsfw` commands are **disabled by default** to keep the command list clean in non-NSFW channels. If you want to use them, please ask a moderator/administrator to read the section below.'
                    },
                    {
                        name: 'For Moderators/Administrators',
                        value: 
                        'As said above, `/nsfw` command is **disabled by default**, meaning only people with **Administrator/Manage Webhooks** permission can use the command!\n\n' +
                        'If you want to **enable it for normal members**:\n' +
                        'Go to **Server Settings** > **Integrations** > **Shinano** > Search for `nsfw` > Enable it for **roles** and **channels** you want.'
                    }
                )
                .setImage('https://cdn.upload.systems/uploads/xI7OxDPg.gif')
            return interaction.reply({embeds: [cantSee], ephemeral: true})
        }

        
        case 'VOTE-CHECK': {
            const user = await User.findOne({userId: interaction.user.id})

            const voteLink: MessageActionRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Vote for Shinano!')
                        .setEmoji('<:topgg:1002849574517477447>')
                        .setURL('https://top.gg/bot/1002193298229829682/vote'),
                )
    
            if (!user.lastVoteTimestamp) {
                // Haven't vote at all
                const noVotes: MessageEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription('You have not voted for Shinano! Please vote using the button below!')
                    .setTimestamp()
                return interaction.reply({embeds: [noVotes], components: [voteLink], ephemeral: true})
            } else if (Math.floor(Date.now() / 1000) - user.lastVoteTimestamp > 43200) {
                // 12 hours has passed
                const votable: MessageEmbed = new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(
                        `Your last vote was <t:${user.lastVoteTimestamp}:R>, you can now vote again using the button below!`
                    )
                    .setTimestamp()
                return interaction.reply({embeds: [votable], components: [voteLink], ephemeral: true})
            } else {
                // 12 hours has not passed
                const unvotable: MessageEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription(
                        `Your last vote was <t:${user.lastVoteTimestamp}:R>, you can vote again <t:${user.lastVoteTimestamp + 43200}:R>`
                    )
                    .setTimestamp()
                return interaction.reply({embeds: [unvotable], ephemeral: true})
            }
        }
    }
})
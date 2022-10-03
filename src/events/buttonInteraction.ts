import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Event } from "../structures/Event";
import { checkVotes } from "../structures/Utils";


export default new Event('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;


    switch (interaction.customId) {
        case 'NONSFW': {
            const cantSee: MessageEmbed = new MessageEmbed()
                .setColor('BLUE')
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
            const voteStatus = await checkVotes(interaction.user.id)
            const voteLink: MessageActionRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Vote for Shinano!')
                        .setEmoji('<:topgg:1002849574517477447>')
                        .setURL('https://top.gg/bot/1002193298229829682/vote'),
                )
    
    
            if (voteStatus == 0) {
                const noVotes: MessageEmbed = new MessageEmbed()
                    .setTitle('Voting Status')
                    .setDescription('You haven\'t voted for Shinano today! Please vote using the button below!')
                    .setColor('RED')
                    .setFooter({text: 'You can vote every 12 hours!'})
                    .setTimestamp()
                return interaction.reply({embeds: [noVotes], components: [voteLink], ephemeral: true})
            } else {
                const votingStatus: MessageEmbed = new MessageEmbed()
                    .setTitle('Voting Status')
                    .setTimestamp()
                    .setColor('GREEN')
                    .setDescription(`You have voted for Shinano! Thank you for the support!`)
                    .setFooter({text: 'You can vote every 12 hours!'})
                return interaction.reply({embeds: [votingStatus], ephemeral: true})
            }
        }
    }
})
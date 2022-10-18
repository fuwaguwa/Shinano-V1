import { ShinanoInteraction } from "../../../typings/Command";
import fetch from 'node-fetch'
import Votes from '../../../schemas/Votes'
import { config } from "dotenv";
import { ButtonInteraction, InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
config();

export async function devVoteCheck(interaction: ShinanoInteraction) {
    const user = interaction.options.getUser('user')

    // Database
    let voteTimestamp: number | string;
    let voteStatus: boolean | string = false;

    const voteUser = await Votes.findOne({userId: user.id})

    if (voteUser) {
        const currentTime = Math.floor(Date.now() / 1000)
        voteTimestamp = voteUser.voteTimestamp

        if (currentTime - voteUser.voteTimestamp >= 43200)  voteStatus = true
        
    } else {
        voteStatus = "N/A"
        voteTimestamp = "N/A"
    }



    // Top.gg Database
    let topggVoteStatus: boolean = false

    const response = await fetch(`https://top.gg/api/bots/1002193298229829682/check?user=${user.id}`, {
        method: "GET",
        headers: {
            "Authorization": process.env.topggApiKey
        }
    })
    const topggResult = await response.json()

    if (topggResult.voted == 1) topggVoteStatus = true



    // Response
    const voteEmbed: MessageEmbed = new MessageEmbed()
        .setColor('BLUE')
        .addFields(
            {
                name: 'Top.gg Database:',
                value: `Voted: ${topggVoteStatus}`
            },
            {
                name: 'Shinano Database:',
                value: 
                `Votable: ${voteStatus}\n` +
                `Last Voted: ${
                    typeof voteTimestamp != 'string'
                        ? `<t:${voteTimestamp}:R> | <t:${voteTimestamp}>`
                        : `N/A`
                }`
            }
        )

    const approve: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Update user in database')
                .setEmoji('✅')
                .setStyle('SUCCESS')
                .setCustomId('ADB')
                .setDisabled(false)
        )
    
    const message = await interaction.editReply({embeds: [voteEmbed], components: [approve]})


    
    // Collector
    const collector: InteractionCollector<ButtonInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 60000
    })


    collector.on('collect', async (i) => {
        if (i.user.id !== '836215956346634270') {
            return i.reply({
                content: 'This button is not for you!',
                ephemeral: true
            })
        }

        if (!voteUser) {
            await Votes.create({
                userId: user.id,
                voteTimestamp: Math.floor(Date.now() / 1000)
            })
        } else {
            await voteUser.updateOne({voteTimestamp: Math.floor(Date.now() / 1000)})
        }


        const updatedEmbed: MessageEmbed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription('✅ | Updated the database!')

        await i.reply({
            embeds: [updatedEmbed],
            ephemeral: true
        })

        collector.stop()
    })

    collector.on('end', async (collector, reason) => {
        (approve.components[0] as MessageButton).setDisabled(true)
        await interaction.editReply({components: [approve]})
    })
}
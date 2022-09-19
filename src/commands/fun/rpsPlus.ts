import { ButtonInteraction, Collector, InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed, User } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: 'rps',
    description: 'Play a game of rock paper scissor against someone or the bot!',
    cooldown: 4500,
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'The user you want to play against.'
        }
    ],
    run: async({interaction}) => {
        const user: User = interaction.options.getUser('user')
        if (user !== null && user.id !== '977510446447874109' && user.id !== interaction.user.id) {
            await interaction.reply(`<@${user.id}>`)
            // Verifying if the duel gonna happens
            // Buttons
            const AoD = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`ACCEPT-${user.id}`)
                        .setDisabled(false)
                        .setStyle('SUCCESS')
                        .setLabel('Accept'),
                    new MessageButton()
                        .setCustomId(`DECLINE-${user.id}`)
                        .setDisabled(false)
                        .setStyle('DANGER')
                        .setLabel('Decline')
                )

            const choices = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setCustomId(`ROCK-${interaction.user.id}-${user.id}`)
                        .setEmoji('👊'),
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setCustomId(`PAPER-${interaction.user.id}-${user.id}`)
                        .setEmoji('🖐'),
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setCustomId(`SCISSOR-${interaction.user.id}-${user.id}`)
                        .setEmoji('✌'),
                )
            
            
            // Accepting 
            const check: MessageEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('⚔ It\'s Time To D-D-D-DUEL!')
                .setDescription(`${user}\n**${interaction.user.username} challenged you to a game of RPS!**\nReact to this message to accept or decline the duel!`)
            const message  = await interaction.editReply({
                embeds: [check],
                components: [AoD]
            })

            const acceptor: InteractionCollector<ButtonInteraction> = (message as Message).createMessageComponentCollector({
                time: 30000,
                componentType: 'BUTTON'
            })

            acceptor.on('collect', async (i) => {
                const customId = i.customId.split('-')[0]

                if (!i.customId.endsWith(i.user.id)) {
                    return i.reply({
                        content: 'This button is not for you!',
                        ephemeral: true
                    })
                }

                await i.deferUpdate()
                switch (customId) {
                    case 'ACCEPT': {
                        const res: MessageEmbed = new MessageEmbed()
                            .setColor('BLUE')
                            .setDescription(`\`${interaction.user.username}\` vs \`${user.username}\`\n\n${user}, make your choice!`)
                        await i.editReply({
                            content: `${user}`,
                            embeds: [res],
                            components: [choices]
                        })
                        acceptor.stop('ACCEPTED')
                        break
                    }

                    case 'DECLINE': {
                        const declined: MessageEmbed = new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`❌ \`${user.username}\` declined the duel!`)
                        await i.editReply({
                            content: ``,
                            embeds: [declined],
                            components: []
                        })
                        acceptor.stop('DECLINED')
                        break
                    }
                }
            }) 

            acceptor.on('end', async (collected, reason) => {
                if (reason !== 'ACCEPTED' && reason !== 'DECLINED') {
                    const timeout: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`❌ \`${user.username}\` did not respond!`)
                    await interaction.editReply({
                        embeds: [timeout]
                    })
                } else if (reason === 'ACCEPTED') {
                    const duel: InteractionCollector<ButtonInteraction> = (message as Message).createMessageComponentCollector({
                        componentType: 'BUTTON',
                        time: 30000
                    })


                    var choiceMade: boolean = false
                    var iUserChoice: string
                    var opponentChoice: String
                    duel.on('collect', async (i) => {
                        const customId = i.customId.split('-')[0]
                        const iUser = i.customId.split('-')[1]
                        const opponent = i.customId.split('-')[2]

                        if (choiceMade == false) {
                            choiceMade = true
                            
                            if (i.user.id !== opponent) {
                                return i.reply({
                                    content: 'This button is not for you!',
                                    ephemeral: true
                                })
                            }

                            await i.deferUpdate()
                            opponentChoice = customId
                            const res: MessageEmbed = new MessageEmbed()
                                .setColor('BLUE')
                                .setDescription(`\`${interaction.user.username}\` vs \`${user.username}\`\n\n${interaction.user}, make your choice!`)
                            await i.editReply({
                                content: `${interaction.user}`,
                                embeds: [res],
                                components: [choices]
                            })

                            duel.resetTimer()
                        } else {
                            if (i.user.id !== iUser) {
                                return i.reply({
                                    content: 'This button is not for you!',
                                    ephemeral: true
                                })
                            }

                            await i.deferUpdate()
                            iUserChoice = customId

                            if (iUserChoice === 'ROCK') var convertedUserChoice = '👊';
                            if (iUserChoice === 'PAPER') var convertedUserChoice = '🖐';
                            if (iUserChoice === 'SCISSOR') var convertedUserChoice = '✌';
            
                            if (opponentChoice === 'ROCK') var convertedOPChoice = '👊';
                            if (opponentChoice === 'PAPER') var convertedOPChoice = '🖐';
                            if (opponentChoice === 'SCISSOR') var convertedOPChoice = '✌';

                            var res: MessageEmbed = new MessageEmbed()
                                .setColor('BLUE')
                            if (iUserChoice === opponentChoice) {
                                res
                                    .setDescription(`\`${interaction.user.username}\` vs \`${user.username}\`\n\n${user.username} picked ${convertedOPChoice}\n${interaction.user.username} picked ${convertedUserChoice}\nIt's a draw!`)
                            } else {
                                if (iUserChoice === 'ROCK' && opponentChoice === 'PAPER' ||
                                iUserChoice === 'PAPER' && opponentChoice === 'SCISSOR' ||
                                iUserChoice === 'SCISSOR' && opponentChoice === 'ROCK') {
                                    res
                                    .setDescription(`\`${interaction.user.username}\` vs \`${user.username}\`\n\n${user.username} picked ${convertedOPChoice}\n${interaction.user.username} picked ${convertedUserChoice}\n${user.username} wins!`)
                                } else {
                                    res
                                    .setDescription(`\`${interaction.user.username}\` vs \`${user.username}\`\n\n${user.username} picked ${convertedOPChoice}\n${interaction.user.username} picked ${convertedUserChoice}\n${interaction.user.username} wins!`)
                                }
                            }

                            for (let i = 0; i < 3; i++) {
                                (choices.components[i] as MessageButton).setDisabled(true);
                                (choices.components[i] as MessageButton).setStyle('SECONDARY');
                            }
        
                            await i.editReply({
                                embeds: [res],
                                components: [choices]
                            })

                            duel.stop('finished')
                        }
                    })

                    duel.on('end', async (collected, reason) => {
                        if (reason !== 'finished') {
                            await interaction.editReply({
                                content: `❌ No interaction from user, duel ended!`
                            })
                        }
                    })
                }
            })
            
        } else {
            await interaction.deferReply()
            const allChoices = ['ROCK', 'PAPER', 'SCISSOR']
            const botChoice = allChoices[Math.floor(Math.random() * allChoices.length)]

            // Buttons
            const choices = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setCustomId(`ROCK-${interaction.user.id}`)
                        .setEmoji('👊'),
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setCustomId(`PAPER-${interaction.user.id}`)
                        .setEmoji('🖐'),
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setCustomId(`SCISSOR-${interaction.user.id}`)
                        .setEmoji('✌'),
                )


            const res: MessageEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setDescription(`\`${interaction.user.username}\` vs \`Shinano\`\n\nMake your choice!`)
            

            // Collector
            const message = await interaction.editReply({
                embeds: [res],
                components: [choices]
            })

            const collector: InteractionCollector<ButtonInteraction> = (message as Message).createMessageComponentCollector({
                componentType: 'BUTTON',
                time: 30000
            })

            collector.on('collect', async (i) => {
                const customId = i.customId.split('-')[0]
                

                // Converting Choices
                if (customId === 'ROCK') var convertedUserChoice = '👊';
                if (customId === 'PAPER') var convertedUserChoice = '🖐';
                if (customId === 'SCISSOR') var convertedUserChoice = '✌';

                if (botChoice === 'ROCK') var convertedBotChoice = '👊';
                if (botChoice === 'PAPER') var convertedBotChoice = '🖐';
                if (botChoice === 'SCISSOR') var convertedBotChoice = '✌';


            
                // Verifying Interaction
                if (!i.customId.endsWith(i.user.id)) {
                    return i.reply({
                        content: 'This button is not for you!',
                        ephemeral: true
                    })
                }


                // Response
                await i.deferUpdate()
                for (let i = 0; i < 3; i++) {
                    (choices.components[i] as MessageButton).setDisabled(true);
                    if (customId === (choices.components[i] as MessageButton).customId.split('-')[0]) {
                        (choices.components[i] as MessageButton).setStyle('SUCCESS');
                    } else {
                        (choices.components[i] as MessageButton).setStyle('SECONDARY');
                    }
                }
                var res: MessageEmbed = new MessageEmbed()
                    .setColor('BLUE')

                if (customId === botChoice) {
                    res
                        .setDescription(`\`${interaction.user.username}\` vs \`Shinano\`\n\nI picked ${convertedBotChoice}\nYou picked ${convertedUserChoice}\nIt's a draw!`)
                } else {
                    if (customId === 'ROCK' && botChoice === 'PAPER' ||
                    customId === 'PAPER' && botChoice === 'SCISSOR' ||
                    customId === 'SCISSOR' && botChoice === 'ROCK') {
                        res
                            .setDescription(`\`${interaction.user.username}\` vs \`Shinano\`\n\nI picked ${convertedBotChoice}\nYou picked ${convertedUserChoice}\nI won!`)
                    } else {
                        res
                            .setDescription(`\`${interaction.user.username}\` vs \`Shinano\`\n\nI picked ${convertedBotChoice}\nYou picked ${convertedUserChoice}\nYou won!`)
                    }
                }

                await i.editReply({
                    embeds: [res],
                    components: [choices]
                })
                collector.stop('picked')
            })

            collector.on('end', async (collected, reason) => {
                if (reason !== 'picked') {
                    for (let i = 0; i < 3; i++) {
                        (choices.components[i] as MessageButton).setDisabled(true);
                        (choices.components[i] as MessageButton).setStyle('SECONDARY');
                    }
                    const res: MessageEmbed = new MessageEmbed()
                        .setColor('BLUE')
                        .setDescription(`\`${interaction.user.username}\` vs \`Shinano\`\n\nUser didn't make a choice!`) 

                    await interaction.editReply({
                        embeds: [res],
                        components: [choices]
                    })
                }
            })
        }
    }
})
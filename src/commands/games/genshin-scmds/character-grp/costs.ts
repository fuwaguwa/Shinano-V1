import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { ShinanoPaginator } from "../../../../structures/Pages";
import { color } from "../../../../structures/Genshin";


export async function genshinCharacterCosts(interaction: ShinanoInteraction, character: genshin.Character) {
    // MC Checking
    let embedColor = color(character)
    if (character.name === 'Aether' || character.name === 'Lumine') embedColor = 'GREY'


    // Ascensions
    const ascensionsCosts = []
    const ascensionsCostsEmbed: MessageEmbed[] = []


    for (let ascensionLevel in character.costs) {
        let matz = []
        character.costs[ascensionLevel].forEach((material) => {
            matz.push(
                `${material.count}x **${material.name}**`
            )
        })
        ascensionsCosts.push(matz.join('\n'))
    }

    for (let i = 0; i < ascensionsCosts.length; i++) {
        ascensionsCostsEmbed.push(
            new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`${character.name}'s Ascension Costs`)
                .setThumbnail(character.images.icon)
                .addField(`Ascension ${i + 1}:`, ascensionsCosts[i])
        )
    }


    // Talents
    const talentCosts = genshin.talents(character.name).costs

    const costs = []
    const talentsCostsEmbed: MessageEmbed[] = []

    for (let level in talentCosts) {
        let matz = []
        talentCosts[level].forEach((item) => {
            matz.push(
                `${item.count}x **${item.name}**`
            )
        })
        costs.push(matz.join("\n"))
    }
    
    for (let i = 0; i < costs.length; i++) {
        talentsCostsEmbed.push(
            new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`${character.name}'s Talents Costs`)
                .setThumbnail(character.images.icon)
                .addField(`Level ${i + 2}`, costs[i])
        )
    }



    // Menu
    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setDisabled(false)
                .setMinValues(1)
                .setMaxValues(1)
                .setCustomId(`${character.name}-${interaction.user.id}`)
                .addOptions(
                    {
                        label: 'Ascensions',
                        emoji: '📈',
                        value: 'ascensions',
                        default: true
                    },
                    {
                        label: 'Talents',
                        emoji: '⚔️',
                        value: 'talents',
                        default: false
                    }
                )
        )

    
    // Collector
    const message = await interaction.editReply({embeds: [ascensionsCostsEmbed[0]], components: [navigation]})
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 60000
    })

    ShinanoPaginator({
        interaction: interaction,
        pages: ascensionsCostsEmbed,
        interactorOnly: true,
        timeout: 60000,
        menu: navigation
    })

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(interaction.user.id)) {
            return i.reply({
                content: 'This menu is not for you!', 
                ephemeral: true
            })
        }


        const selectMenu = navigation.components[0] as MessageSelectMenu


        await i.deferUpdate()
        switch (i.values[0]) {
            case 'ascensions': {
                selectMenu.options[0].default = true
                selectMenu.options[1].default = false

                ShinanoPaginator({
                    interaction: interaction,
                    pages: ascensionsCostsEmbed,
                    interactorOnly: true,
                    timeout: 60000,
                    menu: navigation
                })
            }

            case 'talents': {
                selectMenu.options[0].default = false
                selectMenu.options[1].default = true

                ShinanoPaginator({
                    interaction: interaction,
                    pages: talentsCostsEmbed,
                    interactorOnly: true,
                    timeout: 60000,
                    menu: navigation
                })
            }
        }

        collector.resetTimer()
    })
}

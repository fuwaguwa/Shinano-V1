import { MessageActionRow, MessageSelectMenu, InteractionCollector, SelectMenuInteraction, Message } from "discord.js";
import { client } from "../../../../..";
import { ShinanoPaginator } from "../../../../../lib/Pages";
import { ShinanoInteraction } from "../../../../../typings/Command";

export async function shinanoHelpSFW(interaction: ShinanoInteraction) {
    await interaction.deferReply()
    const allCommands = await client.generateCommandList()


    // Selection Menu
    const navigation = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(`NAVCAT-${interaction.user.id}`)
                .setMaxValues(1)
                .setMinValues(1)
                .setDisabled(false)
                .addOptions(
                    {
                        label: 'Fun',
                        value: 'Fun',
                        description: 'Entertain yourself with these commands!',
                        default: true,
                        emoji: '🎉'
                    },
                    {
                        label: 'Image',
                        description: 'Generate (catgirls) images and manipulate them with these commands!',
                        value: 'Image',
                        default: false,
                        emoji: '📸'
                    },
                    {
                        label: 'Misc',
                        description: 'Miscellaneous Commands.',
                        value: 'Miscellaneous',
                        default: false,
                        emoji: '⭐'
                    },
                    {
                        label: 'Reactions',
                        description: 'React to a friend with these commands!',
                        value: 'Reactions',
                        default: false,
                        emoji: '😊'
                    },
                    {
                        label: 'Utilities',
                        description: 'Utilities Commands.',
                        value: 'Utilities',
                        default: false,
                        emoji: '🛠'
                    },
                    {
                        label: 'Azur Lane',
                        description: 'Azur Lane utilities commands!',
                        value: 'AzurLane',
                        default: false,
                        emoji: '⚓'
                    },
                    {
                        label: 'Genshin',
                        description: 'Genshin utilities commands!',
                        value: 'GenshinImpact',
                        default: false,
                        emoji: '⚔️'
                    },
                    {
                        label: 'Anime',
                        description: 'Search up information about an anime/anime character!',
                        value: 'Anime',
                        default: false,
                        emoji: '🎎'
                    },
                )
        )

    
    const message = await interaction.editReply({
        embeds: [allCommands['Fun'][0]],
        components: [navigation]
    })

    await ShinanoPaginator({
        interaction: interaction,
        menu: navigation,
        pages: allCommands['Fun'],
        interactorOnly: true,
        timeout: 30000
    })


    // Collector
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 30000
    })

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(i.user.id)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }
        
        const select = navigation.components[0] as MessageSelectMenu
        await i.deferUpdate()

        for (let j = 0; j < select.options.length; j++) {
            select.options[j].value === i.values[0] ? select.options[j].default = true : select.options[j].default = false
        }

        await ShinanoPaginator({
            interaction: interaction,
            timeout: 30000,
            menu: navigation,
            interactorOnly: true,
            pages: allCommands[i.values[0]]
        })
        collector.resetTimer()
    })
}
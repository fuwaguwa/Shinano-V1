import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { rarityColor } from "../../../../lib/Genshin";
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { toTitleCase } from "../../../../lib/Utils";

export async function genshinArtifact(interaction: ShinanoInteraction) {
    // Fetching info
    const name: string = interaction.options.getString('artifact-name').toLowerCase()
    const artifact: genshin.Artifact = genshin.artifacts(name)

    if (!artifact) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | No artifact set found!')
        return interaction.editReply({embeds: [noResult]})
    }
    
    const embedColor = rarityColor(artifact.rarity[artifact.rarity.length - 1])


    // Outputting data
    const artifactParts: string[] = ['flower', 'plume', 'sands', 'goblet', 'circlet']
    let artifactPartsInfo;


    // General info
    const infoEmbed: MessageEmbed = new MessageEmbed()
        .setTitle(artifact.name)
        .setColor(embedColor)
    if (artifact.url.fandom) infoEmbed.setDescription(`[Wiki Link](${artifact.url.fandom})`)
    

    // 1 Piece
    if (artifact["1pc"]) {
        infoEmbed
            .setThumbnail(artifact.images.circlet)
            .setDescription(`*${artifact.circlet.description}*`)
            .addField('1-piece Effect:', artifact["1pc"])
        return interaction.editReply({embeds: [infoEmbed]})
    }


    // 2 Pieces+
    infoEmbed.setThumbnail(artifact.images.flower)
    if (artifact["2pc"]) infoEmbed.addField('2-pieces Effect:', artifact["2pc"])
    if (artifact["4pc"]) infoEmbed.addField('4-pieces Effect:', artifact["4pc"])

    
    // Other artifacts part
    for (let i = 0; i < artifactParts.length; i++) {
        const part = artifactParts[i]
        artifactPartsInfo = Object.assign({
            [`${part}`]: new MessageEmbed()
                .setTitle(`${toTitleCase(part)}: ${artifact[part].name}`)
                .setColor(embedColor)
                .setDescription(`*${artifact[part].description}*`)
                .setThumbnail(artifact.images[part])
        }, artifactPartsInfo)
    }



    // Menu
    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(`ARTI-${interaction.user.id}`)
                .setMinValues(1)
                .setMaxValues(1)
                .setDisabled(false)
                .addOptions(
                    {
                        label: 'Set Info',
                        value: 'info',
                        emoji: '📝',
                        default: true
                    },
                    {
                        label: `Flower: ${artifact.flower.name}`,
                        value: 'flower',
                        emoji: '🌸',
                        default: false
                    },
                    {
                        label: `Plume: ${artifact.plume.name}`,
                        value: 'plume',
                        emoji: '🪶',
                        default: false
                    },
                    {
                        label: `Sands: ${artifact.sands.name}`,
                        value: 'sands',
                        emoji: '⌛',
                        default: false
                    },
                    {
                        label: `Goblet: ${artifact.goblet.name}`,
                        value: 'goblet',
                        emoji: '🏆',
                        default: false
                    },
                    {
                        label: `Circlet: ${artifact.circlet.name}`,
                        value: 'circlet',
                        emoji: '👑',
                        default: false,
                    },
                )
        )
    
    
    // Collector
    const message = await interaction.editReply({embeds: [infoEmbed], components: [navigation]})
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 120000
    })

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(i.user.id)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }


        const selectMenu = navigation.components[0] as MessageSelectMenu
        await i.deferUpdate()
        switch (i.values[0]) {
            case 'info': {
                for (let i = 0; i < selectMenu.options.length; i++) {
                    i == 0
                        ? selectMenu.options[i].default = true
                        : selectMenu.options[i].default = false
                }

                await interaction.editReply({embeds: [infoEmbed], components: [navigation]})
                break
            }

            default: {
                const defaultOption = selectMenu.options.filter(option => option.value === i.values[0])
                const defaultVal = selectMenu.options.indexOf(defaultOption[0])

                for (let i = 0; i < selectMenu.options.length; i++) {
                    i === defaultVal
                        ? selectMenu.options[i].default = true
                        : selectMenu.options[i].default = false
                }

                await interaction.editReply({embeds: [artifactPartsInfo[i.values[0]]], components: [navigation]})
                break
            }
        }
    })
}
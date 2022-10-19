import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { Element } from "../../../../typings/Genshin";
import { color, icon, stars } from "../../../../structures/Genshin";
import { ShinanoPaginator } from "../../../../structures/Pages";


export async function genshinCharacterInfo(interaction: ShinanoInteraction, character: genshin.Character, elementColors: Element, elementIcons: Element) {
    // MC Checking
    let MC: boolean = false
    let embedColor = color(character, elementColors)
    if (character.name === 'Aether' || character.name === 'Lumine') {
        MC = true
        embedColor = 'GREY'
    }


    // General Info
    const infoEmbed: MessageEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`${character.name} | ${MC == true ? 'Main Character' : character.title}`)
        .setDescription(`"${character.description}"\n\n${character.url ? `[Wiki Link](${character.url.fandom})` : ""}`)
        .setThumbnail(character.images.icon)
        .addFields(
            {name: 'Element:', value: MC == true ? 'All' : icon(character, elementIcons)},
            {name: 'Rarity:', value: stars(character)},
            {name: 'Weapon Type:', value: character.weapontype},
            {name: 'Constellation', value: character.constellation},
            {name: 'Birthday:', value: MC == true ? 'Player\'s Birthday' : character.birthday},
            {name: 'Region | Affiliation', value: MC == true ? '? | Many' : `${character.region} | ${character.affiliation}`},
            {name:"VAs:", value:`CN: ${character.cv.chinese}\nJP: ${character.cv.japanese}\nKR: ${character.cv.korean}\nEN: ${character.cv.english}`}
        )
        .setFooter({text: `Added in Version ${character.version}`})
    
    
    // Constellation
    const characterCons = genshin.constellations(character.name)

    const consInfo = []
    for (let cons in characterCons) {
        if (cons !== 'name' && cons !== 'images' && cons !== 'version') {
            consInfo.push({
                name: cons.toUpperCase() + ' | ' + characterCons[cons].name,
                description: characterCons[cons].effect
            })
        }
    }


    const consEmbed: MessageEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`${character.name}'s Constellations`)
        .setThumbnail(character.images.icon)
    consInfo.forEach((cons) => {
        consEmbed
            .addField(cons.name, cons.description)
    })


    // Talents
    const talents = genshin.talents(character.name)
    const charTalents: MessageEmbed[] = []


    // Combat Talent
    for (let i = 0; i < 3; i++) {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(`${character.name}'s Talents`)
            .setThumbnail(character.images.icon)

        if (i + 1 != 1) embed.setDescription(`*${talents[`combat${i + 1}`].description}*`)
        switch (i + 1) {
            case 1: {
                embed
                    .addField(
                        talents.combat1.name,
                        talents.combat1.info
                    )
                break
            }

            case 2: {
                embed
                    .addField(
                        `Elemental Skill: ${talents.combat2.name}`,
                        talents.combat2.info
                    )
                break
            }

            case 3: 
                embed 
                    .addField(
                        `Elemental Burst: ${talents.combat3.name}`,
                        talents.combat3.info
                    )
                break
        }
        charTalents.push(embed)
    }

    // Passive Talents
    for (let i = 0; i < 2; i++) {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(`${character.name}'s Talents`)
            .setThumbnail(character.images.icon)
            .addField(
                `Passive: ${talents[`passive${i + 1}`].name}`,
                talents[`passive${i + 1}`].info
            )
        charTalents.push(embed)
    }



    // Menu
    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setMinValues(1)
                .setMaxValues(1)
                .setCustomId(`${character.name}-${interaction.user.id}`)
                .setDisabled(false)
                .addOptions(
                    {
                        label: 'Info',
                        value: 'info',
                        emoji: '📝',
                        default: true
                    },
                    {
                        label: 'Constellations',
                        value: 'constellations',
                        emoji: '⭐',
                        default: false
                    },
                    {
                        label: 'Talents',
                        value: 'talents',
                        emoji: '⚔️',
                        default: false
                    }
                )
        )
    

    // Collector
    const message = await interaction.editReply({embeds: [infoEmbed], components: [navigation]})
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 120000
    })    

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(interaction.user.id)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }
        

        await i.deferUpdate()
        const selectMenu = navigation.components[0] as MessageSelectMenu

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

            case 'constellations': {
                for (let i = 0; i < selectMenu.options.length; i++) {
                    i == 1
                        ? selectMenu.options[i].default = true
                        : selectMenu.options[i].default = false
                }
                await interaction.editReply({embeds: [consEmbed], components: [navigation]})
                break
            }

            case 'talents': {
                for (let i = 0; i < selectMenu.options.length; i++) {
                    i == 2
                        ? selectMenu.options[i].default = true
                        : selectMenu.options[i].default = false
                }

                ShinanoPaginator({
                    interaction: interaction,
                    interactorOnly: true, 
                    pages: charTalents,
                    menu: navigation,
                    timeout: 120000,
                })
                break
            }
        }

        collector.resetTimer()
    })

    collector.on('end', async (collected, reason) => {
        navigation.components[0].setDisabled(true)
        await interaction.editReply({components: [navigation]})
    })
}
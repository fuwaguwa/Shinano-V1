import { ShinanoInteraction } from "../../../../../typings/Command";
import genshin from 'genshin-db';
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { rarityColor, stars } from "../../../../../structures/Genshin";
import { strFormat } from "../../../../../structures/Utils";
import { ShinanoPaginator } from "../../../../../structures/Pages";

export async function genshinWeaponInfo(interaction: ShinanoInteraction, weapon: genshin.Weapon) {
    // Filtering data
    // % Stats
    let subValue: string
    if (weapon.substat) {
        if (weapon.substat.toLowerCase() !== 'elemental mastery') {
            subValue = `${weapon.subvalue}% ${weapon.substat}`
        } else {
            subValue = `${weapon.subvalue} ${weapon.substat}`
        }
    }

    
    // Refinement Stats
    const refinementStats = []
    if (weapon.effect) {
        for (let i = 0; i < 5; i++) {
            if (i == 0) {
                weapon[`r${i + 1}`].forEach(stat => {
                    refinementStats.push(stat)
                })
            } else {
                for (let k = 0; k < weapon.r1.length; k++) {
                    refinementStats[k] += `/${weapon[`r${i + 1}`][k]}`
                }
            }
        }

        for (let i = 0; i < refinementStats.length; i++) {
            refinementStats[i] = `**${refinementStats[i]}**`
        }
    }


    // General Info
    const embedColor: any = rarityColor(weapon)
    const weaponInfo: MessageEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(weapon.name)
        .setDescription(`*${weapon.description}*\n\n${weapon.url ? `[Wiki Link](${weapon.url.fandom})` : ""}`)
        .setThumbnail(weapon.images.icon)
        .addFields(
            {
                name: 'Rarity',
                value: stars(weapon)
            },
            {
                name: 'Weapon Type:',
                value: weapon.weapontype
            },
            {
                name: 'Base Stats',
                value: 
                `Base ATK: **${weapon.baseatk} ATK**\n` + 
                `${subValue ? `Base Substat: **${subValue}**\n` : ``}`
            }
        )
    if (weapon.effect) {
        weaponInfo
            .addField(
                `Effect: ${weapon.effectname}`,
                strFormat(weapon.effect, refinementStats)
            )
    }


    // Ascensions Costs
    const ascensionsCosts = []
    const ascensionsCostsEmbeds: MessageEmbed[] = []


    for (let ascensionLevel in weapon.costs) {
        let matz = []
        weapon.costs[ascensionLevel].forEach((material) => {
            matz.push(
                `${material.count}x **${material.name}**`
            )
        })
        ascensionsCosts.push(matz.join('\n'))
    }

    for (let i = 0; i < ascensionsCosts.length; i++) {
        ascensionsCostsEmbeds.push(
            new MessageEmbed()
                .setColor(embedColor)
                .setTitle(`${weapon.name}'s Ascension Costs`)
                .setThumbnail(weapon.images.icon)
                .addField(`Ascension ${i + 1}:`, ascensionsCosts[i])
        )
    }



    // Menu
    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setMaxValues(1)
                .setMinValues(1)
                .setDisabled(false)
                .setCustomId(`WEAPON-${interaction.user.id}`)
                .addOptions(
                    {
                        label: 'Info',
                        value: 'info',
                        emoji: '📝',
                        default: true
                    },
                    {
                        label: 'Ascension Costs',
                        value: 'costs',
                        emoji: '💵',
                        default: false
                    },
                )
        )
    
    
    // Collector
    const message = await interaction.editReply({embeds: [weaponInfo], components: [navigation]})
    const collector = await (message as Message).createMessageComponentCollector({
        time: 120000
    })

    collector.on('collect', async (i) => {
        if (!i.customId.endsWith(i.user.id)) {
            return i.reply({
                content: 'This menu is not for you!',
                ephemeral: true
            })
        }


        if (i['values']) {
            await i.deferUpdate()
        
            const selectMenu = navigation.components[0] as MessageSelectMenu
            switch (i['values'][0]) {
                case 'info': {
                    selectMenu.options[0].default = true
                    selectMenu.options[1].default = false

                    await interaction.editReply({embeds: [weaponInfo], components: [navigation]})
                    break
                }

                
                case 'costs': {
                    selectMenu.options[0].default = false
                    selectMenu.options[1].default = true

                    await ShinanoPaginator({
                        interaction: interaction,
                        interactorOnly: true,
                        timeout: 120000,
                        pages: ascensionsCostsEmbeds,
                        menu: navigation
                    })
                    break
                }
            }
        }
    })
}
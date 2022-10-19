import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { InteractionCollector, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { color } from "../../../../structures/Genshin";
import { toTitleCase } from "../../../../structures/Utils";
import { ShinanoPaginator } from "../../../../structures/Pages";

export async function genshinCharacterTalents(interaction: ShinanoInteraction) {
    // Reordering 
    let characterName = toTitleCase(interaction.options.getString('character-name').toLowerCase())
    let character: genshin.Character;

    if (characterName.toLowerCase().includes("traveler")) {
        if (characterName.split(" ")[0] !== 'Traveler') characterName = toTitleCase(`Traveler (${characterName.split(" ")[0]})`)
        character = genshin.characters('Aether')
    } else {
        character = genshin.characters(characterName)
        
        if (!character) {
            const noResult: MessageEmbed = new MessageEmbed()
                .setColor('RED')
                .setDescription('❌ | No character found!')
            await interaction.editReply({embeds: [noResult]}) 
        }
    }

    // MC Checking
    let embedColor;
    if (characterName === 'Aether' || characterName === 'Lumine') {
        embedColor = color(characterName.split(" ")[0])
    } else {
        embedColor = color(character)
    }


    // Talents Info
    const talents = genshin.talents(characterName)
    const charTalentsEmbeds: MessageEmbed[] = []

    if (!talents) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | No character found!')
        await interaction.editReply({embeds: [noResult]})   
    }


    // Combat Talent
    for (let i = 0; i < 4; i++) {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(`${characterName}'s Talents`)
            .setThumbnail(character.images.icon)

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
                    .setDescription(`*${talents.combat2.description}*`)
                    .addField(
                        `Elemental Skill: ${talents.combat2.name}`,
                        talents.combat2.info
                    )
                break
            }

            case 3: {
                embed 
                    .setDescription(`*${talents.combatsp.description}*`)
                    .addField(
                        `Alternate Sprint`,
                        talents.combatsp.info
                    )
                break
            }

            case 4: {
                embed 
                    .setDescription(`*${talents.combat3.description}*`)
                    .addField(
                        `Elemental Burst: ${talents.combat3.name}`,
                        talents.combat3.info
                    )
                break
            }

        }
        charTalentsEmbeds.push(embed)
    }

    // Passive Talents
    let count = 2;
    if (talents.passive3) count++;
    if (talents.passive4) count++;

    for (let i = 0; i < count; i++) {
        const embed: MessageEmbed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(`${characterName}'s Talents`)
            .setThumbnail(character.images.icon)
            .addField(
                `Passive: ${talents[`passive${i + 1}`].name}`,
                talents[`passive${i + 1}`].info
            )
        charTalentsEmbeds.push(embed)
    }

    
    // Talents Costs
    const talentCosts = talents.costs

    const costs = []
    const talentsCostsEmbeds: MessageEmbed[] = []
    

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
        talentsCostsEmbeds.push(
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
                .setMinValues(1)
                .setMaxValues(1)
                .setCustomId(`${character.name}-${interaction.user.id}`)
                .setDisabled(false)
                .addOptions(
                    {
                        label: 'Talent Info',
                        value: 'info',
                        emoji: '📝',
                        default: true
                    },
                    {
                        label: 'Talent Costs',
                        value: 'costs',
                        emoji: '💵',
                        default: false
                    },
                )
        )
    

    // Collector
    const message = await interaction.editReply({embeds: [charTalentsEmbeds[0]], components: [navigation]})
    const collector: InteractionCollector<SelectMenuInteraction> = await (message as Message).createMessageComponentCollector({
        componentType: 'SELECT_MENU',
        time: 120000
    })

    ShinanoPaginator({
        interaction: interaction,
        interactorOnly: true,
        pages: charTalentsEmbeds,
        timeout: 120000,
        menu: navigation
    })

    collector.on("collect", async (i) => {
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
                selectMenu.options[0].default = false
                selectMenu.options[1].default = true 
                
                ShinanoPaginator({
                    interaction: interaction,
                    interactorOnly: true,
                    pages: charTalentsEmbeds,
                    timeout: 120000,
                    menu: navigation
                })
                break
            }


            case 'costs': {
                selectMenu.options[0].default = false
                selectMenu.options[1].default = true 
                
                ShinanoPaginator({
                    interaction: interaction,
                    interactorOnly: true,
                    pages: talentsCostsEmbeds,
                    timeout: 120000,
                    menu: navigation
                })
                break
            }
        }
    })
}
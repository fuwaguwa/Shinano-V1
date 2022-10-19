import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { MessageEmbed } from "discord.js";
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


    // Talents
    const talents = genshin.talents(characterName)
    const charTalents: MessageEmbed[] = []

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
        charTalents.push(embed)
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
        charTalents.push(embed)
    }

    
    // Displaying data
    ShinanoPaginator({
        interaction: interaction,
        interactorOnly: true,
        pages: charTalents,
        timeout: 120000
    })
}
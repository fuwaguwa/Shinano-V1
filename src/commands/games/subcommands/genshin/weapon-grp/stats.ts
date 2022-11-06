import { ShinanoInteraction } from "../../../../../typings/Command";
import genshin from 'genshin-db'
import { rarityColor } from "../../../../../structures/Genshin";
import { MessageEmbed } from "discord.js";
import { strFormat } from "../../../../../structures/Utils";

export async function genshinWeaponStats(interaction: ShinanoInteraction, weapon: genshin.Weapon) {
    // Processing Data
    let level: number = interaction.options.getInteger('weapon-level')
    let ascension = interaction.options.getString('ascension-phase')
    let refinementLevel: string | number = interaction.options.getString('refinement-level')

    let weaponStats = weapon.stats(level)
    if (ascension) weaponStats = weapon.stats(level, parseInt(ascension, 10))
    if (!refinementLevel) refinementLevel = 1

    if (level < 1) level = 1
    if (level > 90) level = 90

    
    let weaponSpecializedStat: string
    if (weapon.substat) {
        if (weapon.substat.toLowerCase() !== 'elemental mastery') {
            weaponSpecializedStat = `${(weaponStats.specialized * 100).toFixed(2)}% ${weapon.substat}`
        } else {
            weaponSpecializedStat = `${weaponStats.specialized.toFixed(2)} ${weapon.substat}`
        }
    }


    // Displaying Data 
    const embedColor = rarityColor(weapon)
    const statsEmbed: MessageEmbed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`${weapon.name}\'s Stats | Level ${level}`)
        .setThumbnail(weapon.images.icon)
        .addFields(
            {
                name: 'Level & Ascensions:',
                value: 
                `Level: **${weaponStats.level}**\n` +
                `Ascensions: **${weaponStats.ascension}**\n` +
                `${weapon.effect ? `Refinement Level: **${refinementLevel}**` : ``}`
            },
            {
                name: 'Weapon\'s Stats:',
                value:
                `ATK: **${weaponStats.attack ? `${weaponStats.attack.toFixed(2)} ATK` : 'N/A'}**\n` +
                `Main Stat: **${weaponStats.specialized ? weaponSpecializedStat : 'N/A'}**\n` 
            },
        )
    if (weapon.effect) {
        const formattedRefinementStats: string[] = []
        weapon[`r${refinementLevel}`].forEach(stat => {
            formattedRefinementStats.push(`**${stat}**`)
        })

        
        statsEmbed
            .addField(
                'Weapon\'s Effect:',
                strFormat(weapon.effect, formattedRefinementStats)
            )
    }
    await interaction.editReply({embeds: [statsEmbed]})
    
}
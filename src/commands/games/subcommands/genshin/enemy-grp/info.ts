import { ShinanoInteraction } from "../../../../../typings/Command";
import genshin from 'genshin-db'
import { MessageEmbed } from "discord.js";
import { toTitleCase } from "../../../../../lib/Utils";

export async function genshinEnemyInfo(interaction: ShinanoInteraction, enemy: genshin.Enemy) {
    // Getting drops
    const possibleDrops: string[] = []
    enemy.rewardpreview.forEach(reward => {
        if (!possibleDrops.includes(reward.name)) possibleDrops.push(reward.name)
    })


    // Display data
    const enemyEmbed: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
        .setTitle(`${enemy.name} | ${enemy.specialname}`)
        .setDescription(`*${enemy.description}*`)
        .addFields(
            {
                name: 'Enemy Type:',
                value: `${toTitleCase(enemy['enemytype'].toLowerCase())}`
            },
            {
                name: 'Enemy Category:',
                value: enemy.category
            },
            {
                name: 'Enemy Drops:',
                value: possibleDrops.join("\n")
            }
        )
    await interaction.editReply({embeds: [enemyEmbed]})
}
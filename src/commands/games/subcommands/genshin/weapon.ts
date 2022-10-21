import { ShinanoInteraction } from '../../../../typings/Command';
import genshin from 'genshin-db'
import { MessageEmbed } from "discord.js";
import { genshinWeaponInfo } from './weapon-grp/info';
import { genshinWeaponStats } from './weapon-grp/stats';

export async function genshinWeapon(interaction: ShinanoInteraction) {
    // Fetching info
    const name: string = interaction.options.getString('weapon-name').toLowerCase()
    const weapon: genshin.Weapon = genshin.weapons(name)

    if (!weapon) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription("❌ | No weapon found!")
        await interaction.editReply({embeds: [noResult]})
    }

    switch (interaction.options.getSubcommand()) {
        case 'info': {
            await genshinWeaponInfo(interaction, weapon)
            break
        }

        case 'stats': {
            await genshinWeaponStats(interaction, weapon)
            break
        }
    }
}
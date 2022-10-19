import { ShinanoInteraction } from "../../../typings/Command";
import { Element } from "../../../typings/Genshin";
import { genshinCharacterCosts } from "./character-grp/costs";
import { genshinCharacterInfo } from "./character-grp/info";
import { genshinCharacterStats } from "./character-grp/stats";
import genshin from 'genshin-db';
import { MessageEmbed } from "discord.js";


export async function genshinCharacter(interaction: ShinanoInteraction, elementColors: Element, elementIcons: Element) {
    // Fetching data
    const name = interaction.options.getString('character-name').toLowerCase()
    const character = genshin.characters(name)

    if (!character) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | No character found!')
        await interaction.editReply({embeds: [noResult]})
    }


    // Processing data
    switch (interaction.options.getSubcommand()) {
        case 'info': {
            await genshinCharacterInfo(interaction, character, elementColors, elementIcons)
            break
        }

        case 'costs': {
            await genshinCharacterCosts(interaction, character, elementColors)
            break
        }

        case 'stats': {
            await genshinCharacterStats(interaction, character, elementColors)
            break
        }
    }
}
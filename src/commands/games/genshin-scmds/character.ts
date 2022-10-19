import { ShinanoInteraction } from "../../../typings/Command";
import { Element } from "../../../typings/Genshin";
import { genshinCharacterCosts } from "./character-grp/costs";
import { genshinCharacterInfo } from "./character-grp/info";
import { genshinCharacterStats } from "./character-grp/stats";


export async function genshinCharacter(interaction: ShinanoInteraction, elementColors: Element, elementIcons: Element) {
    switch (interaction.options.getSubcommand()) {
        case 'info': {
            await genshinCharacterInfo(interaction, elementColors, elementIcons)
            break
        }

        case 'costs': {
            await genshinCharacterCosts(interaction, elementColors)
            break
        }

        case 'stats': {
            await genshinCharacterStats(interaction, elementColors)
        }
    }
}
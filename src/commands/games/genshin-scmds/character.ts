import { ShinanoInteraction } from "../../../typings/Command";
import { genshinCharacterCosts } from "./character-grp/costs";
import { genshinCharacterInfo } from "./character-grp/info";
import { genshinCharacterTalents } from "./character-grp/talents";
import genshin from 'genshin-db';


export async function genshinCharacter(interaction: ShinanoInteraction) {
    // Fetching data
    const name = interaction.options.getString('character-name').toLowerCase()
    const character = genshin.characters(name)
    

    // Processing data
    switch (interaction.options.getSubcommand()) {
        case 'info': {
            await genshinCharacterInfo(interaction, character)
            break
        }


        case 'costs': {
            await genshinCharacterCosts(interaction, character)
            break
        }
        

        case 'talents': {
            await genshinCharacterTalents(interaction)
            break
        }
    }
}
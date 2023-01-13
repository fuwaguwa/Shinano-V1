import { ShinanoInteraction } from "../../../../typings/Command";
import { genshinCharacterInfo } from "./character-grp/info";
import { genshinCharacterTalents } from "./character-grp/talents";
import genshin from "genshin-db";
import { genshinCharacterStats } from "./character-grp/stats";

export async function genshinCharacter(interaction: ShinanoInteraction) {
	// Fetching data
	const name = interaction.options.getString("character-name").toLowerCase();
	const character = genshin.characters(name);

	// Processing data
	switch (interaction.options.getSubcommand())
	{
		case "info": {
			await genshinCharacterInfo(interaction, character);
			break;
		}

		case "stats": {
			await genshinCharacterStats(interaction, character);
			break;
		}

		case "talents": {
			await genshinCharacterTalents(interaction);
			break;
		}
	}
}

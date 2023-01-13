import { ShinanoInteraction } from "../../../../../typings/Command";
import genshin from "genshin-db";
import { color } from "../../../../../lib/Genshin";
import { MessageEmbed } from "discord.js";

export async function genshinCharacterStats(
	interaction: ShinanoInteraction,
	character: genshin.Character
) {
	// Prcessing levels
	let level: number = interaction.options.getInteger("character-level");
	let ascension: string = interaction.options.getString("ascension-phase");

	let characterStats: genshin.StatResult = character.stats(level);
	if (ascension)
		characterStats = character.stats(level, parseInt(ascension, 10));

	if (level < 1) level = 1;
	if (level > 90) level = 90;

	// MC Checking
	let embedColor;
	if (character.name === "Aether" || character.name === "Lumine")
	{
		embedColor = "GREY";
	} else
	{
		embedColor = color(character);
	}

	// Stats
	let characterSpecializedStat: string | number = characterStats.specialized;
	if (characterStats.specialized && characterStats.specialized % 1 != 0)
		characterSpecializedStat =
			(characterStats.specialized * 100).toFixed(2) + "%";

	const statsEmbed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setThumbnail(character.images.icon)
		.setTitle(`${character.name}'s Stats | Level ${level}`)
		.addFields(
			{
				name: "Level & Ascensions:",
				value:
					`Level: **${characterStats.level}**\n` +
					`Ascensions: **${characterStats.ascension}**`,
			},
			{
				name: "Character's Stats:",
				value:
					`HP: **${characterStats.hp ? `${characterStats.hp.toFixed(2)} HP` : "N/A"
					}**\n` +
					`ATK: **${characterStats.attack
						? `${characterStats.attack.toFixed(2)} ATK`
						: "N/A"
					}**\n` +
					`DEF: **${characterStats.defense
						? `${characterStats.defense.toFixed(2)} DEF`
						: "N/A"
					}**\n` +
					`Ascension Stat: **${characterStats.specialized
						? `${characterSpecializedStat} ${character.substat}`
						: "N/A"
					}**\n`,
			}
		);
	await interaction.editReply({ embeds: [statsEmbed] });
}

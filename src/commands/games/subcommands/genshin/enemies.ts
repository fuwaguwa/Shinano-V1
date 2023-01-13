import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from "genshin-db";
import { MessageEmbed } from "discord.js";
import { genshinEnemyInfo } from "./enemy-grp/info";
import { genshinEnemyStats } from "./enemy-grp/stats";

export async function genshinEnemy(interaction: ShinanoInteraction) {
	// Fetching info
	const name: string = interaction.options
		.getString("enemy-name")
		.toLowerCase();
	const enemy: genshin.Enemy = genshin.enemies(name);

	if (!enemy)
	{
		const noResult: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("❌ | No enemy found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	switch (interaction.options.getSubcommand())
	{
		case "info": {
			await genshinEnemyInfo(interaction, enemy);
			break;
		}

		case "stats": {
			await genshinEnemyStats(interaction, enemy);
			break;
		}
	}
}

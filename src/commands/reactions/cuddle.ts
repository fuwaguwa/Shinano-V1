import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from "node-fetch";

export default new Command({
	name: "cuddle",
	description: "Cuddle with someone.",
	cooldown: 4500,
	category: "Reactions",
	options: [
		{
			name: "target",
			description: "The person you want to cuddle with.",
			type: "USER",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		const target: User = interaction.options.getUser("target");
		const response = await fetch("https://waifu.pics/api/sfw/cuddle", {
			method: "GET",
		});
		const rep = await response.json();

		const embed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${target
					? `${interaction.user} cuddled with ${target}!`
					: `You cuddled with yourself...lonely..`
				}`
			)
			.setImage(rep.url);
		await interaction.editReply({ embeds: [embed] });
	},
});

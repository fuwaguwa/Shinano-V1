import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";
import fetch from "node-fetch";

export default new Command({
	name: "pat",
	description: "Give someone headpats",
	cooldown: 4500,
	category: "Reactions",
	options: [
		{
			name: "target",
			description: "The person you want to give headpats to",
			type: "USER",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		const target: User = interaction.options.getUser("target");
		const response = await fetch("https://waifu.pics/api/sfw/pat", {
			method: "GET",
		});
		const rep = await response.json();

		const embed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${target
					? `${interaction.user} patted ${target}!`
					: `You patted yourself...`
				}`
			)
			.setImage(rep.url);
		await interaction.editReply({ embeds: [embed] });
	},
});

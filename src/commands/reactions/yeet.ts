import { Command } from "../../structures/Command";
import fetch from "node-fetch";
import { MessageEmbed, User } from "discord.js";

export default new Command({
	name: "yeet",
	description: "Yeet someone!",
	cooldown: 4500,
	category: "Reactions",
	options: [
		{
			type: "USER",
			name: "target",
			description: "The person you want to yeet",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const target: User = interaction.options.getUser("target");

		const response = await fetch("https://nekos.best/api/v2/yeet");
		const yeet = await response.json();

		const yeetEmbed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setDescription(
				`${
					target
						? `${interaction.user} yeeted ${target}!`
						: `You yeeted yourself...`
				}`
			)
			.setImage(yeet.results[0].url);

		await interaction.editReply({ embeds: [yeetEmbed] });
	},
});

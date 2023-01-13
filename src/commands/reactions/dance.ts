import { Command } from "../../structures/Command";
import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";

export default new Command({
	name: "dance",
	description: "💃🕺",
	cooldown: 4500,
	category: "Reactions",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch("https://nekos.best/api/v2/dance");
		const dance = await response.json();

		const danceEmbed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setImage(dance.results[0].url);

		await interaction.editReply({ embeds: [danceEmbed] });
	},
});

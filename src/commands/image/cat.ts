import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { Command } from "../../structures/Command";

export default new Command({
	name: "cat",
	description: "Generate a picture of a cat.",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch("https://api.thecatapi.com/v1/images/search", {
			method: "GET",
		});
		const cat = await response.json();

		const catEmbed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setImage(cat[0].url)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.editReply({ embeds: [catEmbed] });
	},
});

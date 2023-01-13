import { Command } from "../../structures/Command";
import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";

export default new Command({
	name: "fox",
	description: "Generate an image of a fox!",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch("https://randomfox.ca/floof/", {
			method: "GET",
		});
		const fox = await response.json();

		const foxEmbed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setImage(fox.image)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.editReply({ embeds: [foxEmbed] });
	},
});

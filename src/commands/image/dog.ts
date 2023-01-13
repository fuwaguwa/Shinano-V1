import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { Command } from "../../structures/Command";

export default new Command({
	name: "dog",
	description: "Generate a picture of a dog.",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch("https://api.thedogapi.com/v1/images/search", {
			method: "GET",
		});
		const dog = await response.json();

		const dogEmbed: MessageEmbed = new MessageEmbed()
			.setColor("RANDOM")
			.setImage(dog[0].url)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
			});

		await interaction.editReply({ embeds: [dogEmbed] });
	},
});

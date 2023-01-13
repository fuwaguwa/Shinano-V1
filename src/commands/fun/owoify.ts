import { Command } from "../../structures/Command";
import fetch from "node-fetch";
import { MessageEmbed } from "discord.js";

export default new Command({
	name: "owoify",
	description: "Owoify your text (WARNING: CRINGE)",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: "STRING",
			required: true,
			name: "text",
			description: "The text you want to owoify (Limit: 200 chars)",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const text: string = interaction.options.getString("text");
		if (text.length > 200)
		{
			const invalid: MessageEmbed = new MessageEmbed()
				.setColor("RED")
				.setDescription("❌ | The text limit is 200 characters!");
			return interaction.editReply({ embeds: [invalid] });
		}

		const response = await fetch(
			`https://nekos.life/api/v2/owoify?text=${text.split(" ").join("%20")}`
		);
		const owo = (await response.json()).owo;

		const owoEmbed: MessageEmbed = new MessageEmbed()
			.setColor("#2f3136")
			.setDescription(`> ${owo}\n\n` + `- ${interaction.user}`);

		await interaction.editReply({ embeds: [owoEmbed] });
	},
});

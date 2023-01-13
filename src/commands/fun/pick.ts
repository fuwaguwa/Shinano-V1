import { MessageEmbed } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
	name: "pick",
	description: "Let Shinano pick for you!",
	cooldown: 3000,
	category: "Fun",
	options: [
		{
			type: "STRING",
			required: true,
			name: "choice-1",
			description: "Choice 1.",
		},
		{
			type: "STRING",
			required: true,
			name: "choice-2",
			description: "Choice 2.",
		},
		{
			type: "STRING",
			name: "choice-3",
			description: "Choice 3.",
		},
		{
			type: "STRING",
			name: "choice-4",
			description: "Choice 4.",
		},
		{
			type: "STRING",
			name: "choice-5",
			description: "Choice 5.",
		},
	],
	run: async ({ interaction }) => {
		const choices: string[] = [];
		for (let i = 0; i < 5; i++)
		{
			if (interaction.options.getString(`choice-${i + 1}`))
				choices.push(interaction.options.getString(`choice-${i + 1}`));
		}

		const pickEmbed: MessageEmbed = new MessageEmbed()
			.setColor("#2f3136")
			.setDescription(
				`> **${choices.join(", ")}**\n` +
				`I pick...**${choices[Math.floor(Math.random() * choices.length)]}**!`
			);
		await interaction.reply({ embeds: [pickEmbed] });
	},
});

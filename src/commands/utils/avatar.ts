import { Command } from "../../structures/Command";
import { MessageEmbed, User } from "discord.js";

export default new Command({
	name: "avatar",
	description: "Get user's and guild's avatar",
	cooldown: 4500,
	category: "Utilities",
	options: [
		{
			type: "USER",
			name: "user",
			description: "The user you want the avatar from.",
		},
	],
	run: async ({ interaction }) => {
		const user: User = interaction.options.getUser("user") || interaction.user;
		const avatarEmbed: MessageEmbed = new MessageEmbed()
			.setColor("#2f3136")
			.setDescription(`${user}'s avatar`)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
			.setFooter({ text: `UID: ${user.id}` });
		await interaction.reply({ embeds: [avatarEmbed] });
	},
});

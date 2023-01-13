import { ShinanoInteraction } from "../../../../../typings/Command";
import User from "../../../../../schemas/User";
import { MessageEmbed } from "discord.js";

export async function devInspectUser(interaction: ShinanoInteraction) {
	const user = interaction.options.getUser("user") || interaction.user;
	const userDB = await User.findOne({ userId: user.id });

	const infoEmbed: MessageEmbed = new MessageEmbed()
		.setColor("#2f3136")
		.setTitle(`${user.username}'s Info`)
		.setDescription(
			`User ID: **${userDB.userId}**\n` +
				`Blacklisted: **${
					userDB.blacklisted ? userDB.blacklisted : false
				}**\n` +
				`Commands Executed: **${userDB.commandsExecuted}**`
		);
	await interaction.editReply({ embeds: [infoEmbed] });
}

import { MessageEmbed } from "discord.js";
import { client } from "../../../..";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function shinanoPing(interaction: ShinanoInteraction) {
	const pingEmbed: MessageEmbed = new MessageEmbed()
		.setTitle("Pong 🏓")
		.setDescription(
			`Latency: ${Date.now() - interaction.createdTimestamp
			}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`
		)
		.setColor("#2f3136");
	await interaction.reply({ embeds: [pingEmbed] });
}

import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function shinanoInfo(interaction: ShinanoInteraction) {
	const APIs = [
		"[AzurAPI](https://github.com/AzurAPI/azurapi-js)",
		"[RapidAPI](https://rapidapi.com/)",
		"The [Cat](https://thecatapi.com/)/[Dog](https://thecatapi.com/) API",
		"[SauceNAO](https://saucenao.com/)",
		"[Some Random API](https://some-random-api.ml/)",
		"[waifu.pics](https://waifu.pics)",
		"[nekos.fun](https://nekos.fun)",
		"[nekos.life](https://nekos.life)",
		"[jikan.moe](https://jikan.moe)",
		"[genshin-db](genshin-db](https://github.com/theBowja/genshin-db)",
	];

	const shinanoEmbed: MessageEmbed = new MessageEmbed()
		.setColor("#2f3136")
		.setTitle("Shinano")
		.setDescription(
			"The Multi-Purpose Azur Lane/Genshin Bot!\n" +
				"Developed and Maintained by **Fuwafuwa#2272**\n" +
				"Contributor: **LaziestBoy#7543**\n\n" +
				`**APIs**: ${APIs.join(", ")}\n\n` +
				"Liking the bot so far? Please **vote** and leave Shinano a **rating** on **top.gg**!"
		);

	const buttons1: MessageActionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setStyle("LINK")
			.setEmoji("👋")
			.setLabel("Invite Shinano!")
			.setURL(
				"https://discord.com/api/oauth2/authorize?client_id=1002193298229829682&permissions=137439332480&scope=bot%20applications.commands"
			),
		new MessageButton()
			.setStyle("LINK")
			.setEmoji("⚙️")
			.setLabel("Support Server")
			.setURL("https://discord.gg/NFkMxFeEWr")
	);
	const buttons2: MessageActionRow = new MessageActionRow().addComponents(
		new MessageButton()
			.setStyle("LINK")
			.setEmoji("<:topgg:1002849574517477447>")
			.setLabel("top.gg")
			.setURL("https://top.gg/bot/1002193298229829682"),
		new MessageButton()
			.setStyle("LINK")
			.setEmoji("🤖")
			.setLabel("discordbotlist.com")
			.setURL("https://discord.ly/shinano"),
		new MessageButton()
			.setStyle("LINK")
			.setEmoji("🔨")
			.setLabel("discordservices.net")
			.setURL("https://discordservices.net/bot/1002193298229829682")
	);
	await interaction.reply({
		embeds: [shinanoEmbed],
		components: [buttons1, buttons2],
	});
}

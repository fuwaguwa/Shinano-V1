import { ShinanoInteraction } from "../../../../typings/Command";
import { config } from "dotenv";
import fetch from "node-fetch";
import {
	Collector,
	InteractionCollector,
	Message,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu,
	SelectMenuInteraction,
} from "discord.js";
import { ShinanoPaginator } from "../../../../lib/Pages";
import { genDoujinEmbed, getDoujinTags } from "../../../../lib/Doujin";
import { doujinCode } from "./code";
config();

export async function doujinSearch(interaction: ShinanoInteraction) {
	// Fetching & Filtering
	const name: string = interaction.options.getString("search-query");
	const sorting: string = interaction.options.getString("sorting") || "popular";
	const blacklist =
		"-lolicon -scat -guro -insect -shotacon -amputee -vomit -vore";
	const response = await fetch(
		`${process.env.nhentaiIP}/api/galleries/search?query=${name} ${blacklist}&sort=${sorting}`,
		{ method: "GET" }
	);
	const searchResults = await response.json();

	if (searchResults.error || searchResults.result.length == 0) {
		const noResult: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("❌ | No Result!");
		return interaction.editReply({ embeds: [noResult] });
	}

	// Processing
	const doujinResults: MessageEmbed[] = [];

	let count: number = 10;
	if (searchResults.result.length < 10) count = searchResults.result.length;

	const resultNavi: MessageActionRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setMaxValues(1)
			.setMinValues(1)
			.setCustomId(`RES-${interaction.user.id}`)
			.setPlaceholder(`Doujin Search Results (${count})`)
	);

	for (let i = 0; i < count; i++) {
		const result = searchResults.result[i];
		const tagsInfo = getDoujinTags(result);

		doujinResults.push(genDoujinEmbed(result, tagsInfo));

		(resultNavi.components[0] as MessageSelectMenu).addOptions({
			label: `Page ${i + 1} | ${result.id}`,
			value: `${result.id}`,
		});
	}

	// Collector
	const message = await interaction.editReply({
		embeds: [doujinResults[0]],
		components: [resultNavi],
	});
	const collector: InteractionCollector<SelectMenuInteraction> = await (
		message as Message
	).createMessageComponentCollector({
		componentType: "SELECT_MENU",
		time: 60000,
	});

	await ShinanoPaginator({
		interaction: interaction,
		interactorOnly: true,
		menu: resultNavi,
		pages: doujinResults,
		timeout: 60000,
	});

	collector.on("collect", async (i) => {
		if (!i.customId.endsWith(i.user.id)) {
			return i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		}

		await i.deferUpdate();

		const menu = resultNavi.components[0] as MessageSelectMenu;
		for (let n = 0; n < menu.options.length; n++) {
			(resultNavi.components[0] as MessageSelectMenu).options[n].value ===
			i.values[0]
				? (menu.options[n].default = true)
				: (menu.options[n].default = false);
		}

		await doujinCode(interaction, i.values[0]);
		collector.stop("Processed");
	});

	collector.on("end", async (collected, reason) => {
		if (reason !== "Processed") {
			(resultNavi.components[0] as MessageSelectMenu).setDisabled(true);
			await interaction.editReply({ components: [resultNavi] });
		}
	});
}

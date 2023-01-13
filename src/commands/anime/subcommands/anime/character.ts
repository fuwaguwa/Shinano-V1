import {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
	InteractionCollector,
	SelectMenuInteraction,
	Message,
} from "discord.js";
import { characterInfo } from "../../../../lib/Anime";
import { ShinanoInteraction } from "../../../../typings/Command";
import fetch from "node-fetch";

export async function animeCharacter(interaction: ShinanoInteraction) {
	// Query
	const characterName: string = interaction.options
		.getString("name")
		.toLowerCase();
	const query = `q=${characterName}&order_by=popularity&limit=10&sfw=true`;
	const response = await fetch(`https://api.jikan.moe/v4/characters?${query}`, {
		method: "GET",
	});

	// Filtering
	const charResponse = (await response.json()).data;
	if (charResponse.length == 0)
	{
		const noResult: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("No result can be found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	// Menu
	const resultNavigation: MessageActionRow =
		new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(`CHARES-${interaction.user.id}`)
				.setMaxValues(1)
				.setMinValues(1)
				.setPlaceholder(`Character Search Results (${charResponse.length})`)
		);

	charResponse.forEach((result) => {
		(resultNavigation.components[0] as MessageSelectMenu).addOptions({
			label: `${result.name} | ${result.name_kanji ? result.name_kanji : "No Kanji Name"
				}`,
			value: `${result.mal_id}`,
		});
	});

	// Collector
	const message = await interaction.editReply({
		components: [resultNavigation],
	});
	const resultCollector: InteractionCollector<SelectMenuInteraction> = await (
		message as Message
	).createMessageComponentCollector({
		componentType: "SELECT_MENU",
		time: 120000,
	});

	resultCollector.on("collect", async (i) => {
		if (!i.customId.endsWith(i.user.id))
		{
			return i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		}

		await i.deferUpdate();

		// Fetching Character Info
		const response = await fetch(
			`https://api.jikan.moe/v4/characters/${i.values[0]}/full`,
			{ method: "GET" }
		);
		const character = (await response.json()).data;

		// Sorting VAs
		let VAs: string[] = [];
		if (character && character.voices)
		{
			character.voices.forEach((va) => {
				if (va.language !== "Japanese" && va.language !== "English") return;
				VAs.push(`[${va.person.name}](${va.person.url})`);
			});
		}

		// Character Embed
		const characterEmbed = characterInfo({ character: character, VAs: VAs });

		// Setting Default Buttons
		const menu = resultNavigation.components[0] as MessageSelectMenu;
		for (let n = 0; n < menu.options.length; n++)
		{
			(resultNavigation.components[0] as MessageSelectMenu).options[n].value ===
				i.values[0]
				? (menu.options[n].default = true)
				: (menu.options[n].default = false);
		}
		await interaction.editReply({
			embeds: [characterEmbed],
			components: [resultNavigation],
		});

		resultCollector.resetTimer();
	});

	resultCollector.on("end", async (collected, reason) => {
		// Disable button on timeout
		(resultNavigation.components[0] as MessageSelectMenu).setDisabled(true);
		await interaction.editReply({ components: [resultNavigation] });
	});
}

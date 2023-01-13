import { AzurAPI } from "@azurapi/azurapi";
import {
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
	InteractionCollector,
	SelectMenuInteraction,
	Message,
} from "discord.js";
import { chapterInfo } from "../../../../lib/AL";
import { ShinanoPaginator } from "../../../../lib/Pages";
import { ShinanoInteraction } from "../../../../typings/Command";

export async function azurLaneChapter(
	interaction: ShinanoInteraction,
	AL: AzurAPI
) {
	await interaction.deferReply();
	const chapterNumber: string = interaction.options.getString("chapter-number");
	const chapter = AL.chapters.filter((chapter) => {
		return chapter.id === chapterNumber;
	});

	const info = chapter[0];

	// Normal
	const normalLevels: MessageEmbed[] = chapterInfo(info, "normal");
	if (!info[1].hard)
	{
		return await ShinanoPaginator({
			interaction: interaction,
			interactorOnly: true,
			pages: normalLevels,
			timeout: 120000,
		});
	}

	// Hard
	const hardLevels: MessageEmbed[] = chapterInfo(info, "hard");

	// Selection Menu
	const navigation = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId(`${chapterNumber}-${interaction.user.id}`)
			.setMaxValues(1)
			.setMinValues(1)
			.addOptions(
				{
					label: "Normal",
					value: "normal",
					default: true,
				},
				{
					label: "Hard",
					value: "hard",
					default: false,
				}
			)
	);

	// Paginator
	const message = await interaction.editReply({
		embeds: [normalLevels[0]],
		components: [navigation],
	});

	await ShinanoPaginator({
		interaction: interaction,
		interactorOnly: true,
		pages: normalLevels,
		timeout: 120000,
		menu: navigation,
	});

	// Collector
	const collector: InteractionCollector<SelectMenuInteraction> = (
		message as Message
	).createMessageComponentCollector({
		componentType: "SELECT_MENU",
		time: 60000,
	});

	collector.on("collect", async (i) => {
		// Filtering Interaction
		if (!i.customId.endsWith(i.user.id))
		{
			return i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		}

		await i.deferUpdate();
		switch (i.values[0])
		{
			case "normal": {
				(navigation.components[0] as MessageSelectMenu).options[0].default =
					true;
				(navigation.components[0] as MessageSelectMenu).options[1].default =
					false;

				await ShinanoPaginator({
					interaction: interaction,
					menu: navigation,
					interactorOnly: true,
					pages: normalLevels,
					timeout: 120000,
				});
				break;
			}

			case "hard": {
				(navigation.components[0] as MessageSelectMenu).options[0].default =
					false;
				(navigation.components[0] as MessageSelectMenu).options[1].default =
					true;

				await ShinanoPaginator({
					interaction: interaction,
					menu: navigation,
					interactorOnly: true,
					pages: hardLevels,
					timeout: 120000,
				});
				break;
			}
		}

		collector.resetTimer();
	});
}

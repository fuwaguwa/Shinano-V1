import { ShinanoInteraction } from "../../../../../typings/Command";
import genshin from "genshin-db";
import {
	InteractionCollector,
	Message,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu,
	SelectMenuInteraction,
} from "discord.js";
import { color, icon, stars } from "../../../../../lib/Genshin";
import { ShinanoPaginator } from "../../../../../lib/Pages";

function queryConstellations(
	characterName: string,
	character: genshin.Character,
	embedColor: any
) {
	const characterCons = genshin.constellations(characterName);
	const consInfo = [];
	for (let cons in characterCons) {
		if (cons !== "name" && cons !== "images" && cons !== "version") {
			consInfo.push({
				name: cons.toUpperCase() + " | " + characterCons[cons].name,
				description: characterCons[cons].effect,
			});
		}
	}

	const consEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setTitle(`${characterName}'s Constellations`)
		.setThumbnail(character.images.icon);
	consInfo.forEach((cons) => {
		consEmbed.addField(cons.name, cons.description);
	});
	return consEmbed;
}

function queryTravelerConstellations(character: genshin.Character) {
	const travelerConsPages: MessageEmbed[] = [];
	for (let i = 0; i < 4; i++) {
		let element: string;
		let elementColor;
		switch (i) {
			case 0: {
				(element = "Anemo"), (elementColor = color(element));
				break;
			}

			case 1: {
				(element = "Geo"), (elementColor = color(element));
				break;
			}

			case 2: {
				(element = "Electro"), (elementColor = color(element));
				break;
			}

			case 3: {
				(element = "Dendro"), (elementColor = color(element));
				break;
			}
		}

		travelerConsPages.push(
			queryConstellations(`Traveler (${element})`, character, elementColor)
		);
	}
	return travelerConsPages;
}

function queryGallery(character: genshin.Character, embedColor: any) {
	const galleryImages: MessageEmbed[] = [];
	for (let image in character.images) {
		if (character.images[image]) {
			const imageEmbed: MessageEmbed = new MessageEmbed()
				.setColor(embedColor)
				.setTitle(`${character.name}'s Gallery`);
			switch (image) {
				case "card": {
					imageEmbed
						.setDescription(`**Card**`)
						.setImage(character.images[image]);
					galleryImages.push(imageEmbed);
					break;
				}

				case "portrait": {
					imageEmbed
						.setDescription(`**Portrait**`)
						.setImage(character.images[image]);
					galleryImages.push(imageEmbed);
					break;
				}

				case "icon": {
					imageEmbed
						.setDescription(`**Icon**`)
						.setImage(character.images[image]);
					galleryImages.push(imageEmbed);
					break;
				}

				case "sideicon": {
					imageEmbed
						.setDescription(`**Side Icon**`)
						.setImage(character.images[image]);
					galleryImages.push(imageEmbed);
					break;
				}

				case "cover1": {
					imageEmbed
						.setDescription(`**Cover 1**`)
						.setImage(character.images[image]);
					galleryImages.push(imageEmbed);
					break;
				}

				case "cover2": {
					imageEmbed
						.setDescription(`**Cover 2**`)
						.setImage(character.images[image]);
					galleryImages.push(imageEmbed);
					break;
				}
			}
		}
	}
	return galleryImages;
}

export async function genshinCharacterInfo(
	interaction: ShinanoInteraction,
	character: genshin.Character
) {
	// Checking for character
	if (!character) {
		const noResult: MessageEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("❌ | No character found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	// MC Checking
	let MC: boolean = false;
	let embedColor;
	if (character.name === "Aether" || character.name === "Lumine") {
		MC = true;
		embedColor = "GREY";
	} else {
		embedColor = color(character);
	}

	// General Info
	const infoEmbed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setTitle(`${character.name} | ${MC ? "Main Character" : character.title}`)
		.setDescription(
			`*${character.description}*\n\n${
				character.url ? `[Wiki Link](${character.url.fandom})` : ""
			}`
		)
		.setThumbnail(character.images.icon)
		.addFields(
			{
				name: "Element:",
				value: MC ? "All" : icon(character),
			},
			{
				name: "Rarity:",
				value: stars(character),
			},
			{
				name: "Weapon Type:",
				value: character.weapontype,
			},
			{
				name: "Constellation",
				value: character.constellation,
			},
			{
				name: "Birthday:",
				value: MC ? "Player's Birthday" : character.birthday,
			},
			{
				name: "Region | Affiliation",
				value: MC
					? "? | Many"
					: `${character.region} | ${character.affiliation}`,
			},
			{
				name: "VAs:",
				value: `CN: ${character.cv.chinese}\nJP: ${character.cv.japanese}\nKR: ${character.cv.korean}\nEN: ${character.cv.english}`,
			}
		)
		.setFooter({ text: `Added in Version ${character.version}` });

	// Constellations
	let consEmbed: MessageEmbed;
	let travelerConsPages: MessageEmbed[];

	MC
		? (travelerConsPages = queryTravelerConstellations(character))
		: (consEmbed = queryConstellations(character.name, character, embedColor));

	// Ascensions Costs
	const ascensionsCosts = [];
	const ascensionsCostsEmbeds: MessageEmbed[] = [];

	for (let ascensionLevel in character.costs) {
		let matz = [];
		character.costs[ascensionLevel].forEach((material) => {
			matz.push(`${material.count}x **${material.name}**`);
		});
		ascensionsCosts.push(matz.join("\n"));
	}

	for (let i = 0; i < ascensionsCosts.length; i++) {
		ascensionsCostsEmbeds.push(
			new MessageEmbed()
				.setColor(embedColor)
				.setTitle(`${character.name}'s Ascension Costs`)
				.setThumbnail(character.images.icon)
				.addField(`Ascension ${i + 1}:`, ascensionsCosts[i])
		);
	}

	// Gallery
	const galleryImagesEmbed = queryGallery(character, embedColor);

	// Menu
	const navigation: MessageActionRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setMinValues(1)
			.setMaxValues(1)
			.setCustomId(`${character.name}-${interaction.user.id}`)
			.setDisabled(false)
			.addOptions(
				{
					label: "Info",
					value: "info",
					emoji: "📝",
					default: true,
				},
				{
					label: "Constellations",
					value: "constellations",
					emoji: "⭐",
					default: false,
				},
				{
					label: "Ascension Costs",
					value: "costs",
					emoji: "💵",
					default: false,
				},
				{
					label: "Gallery",
					value: "gallery",
					emoji: "📸",
				}
			)
	);

	// Collector
	const message = await interaction.editReply({
		embeds: [infoEmbed],
		components: [navigation],
	});
	const collector = await (message as Message).createMessageComponentCollector({
		time: 120000,
	});

	let costPage: any = 0;
	let galleryPage: any = 0;

	collector.on("collect", async (i) => {
		if (!i.customId.endsWith(i.user.id)) {
			return i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		}

		if (i["values"]) {
			await i.deferUpdate();
			const selectMenu = navigation.components[0] as MessageSelectMenu;

			switch (i["values"][0]) {
				case "info": {
					for (let i = 0; i < selectMenu.options.length; i++) {
						i == 0
							? (selectMenu.options[i].default = true)
							: (selectMenu.options[i].default = false);
					}

					await interaction.editReply({
						embeds: [infoEmbed],
						components: [navigation],
					});
					break;
				}

				case "constellations": {
					for (let i = 0; i < selectMenu.options.length; i++) {
						i == 1
							? (selectMenu.options[i].default = true)
							: (selectMenu.options[i].default = false);
					}

					if (MC) {
						await ShinanoPaginator({
							interaction: interaction,
							interactorOnly: true,
							pages: travelerConsPages,
							timeout: 120000,
							menu: navigation,
						});
					} else {
						await interaction.editReply({
							embeds: [consEmbed],
							components: [navigation],
						});
					}
					break;
				}

				case "costs": {
					for (let i = 0; i < selectMenu.options.length; i++) {
						i == 2
							? (selectMenu.options[i].default = true)
							: (selectMenu.options[i].default = false);
					}

					costPage = await ShinanoPaginator({
						interaction: interaction,
						interactorOnly: true,
						pages: ascensionsCostsEmbeds,
						page: costPage,
						timeout: 120000,
						menu: navigation,
					});
					break;
				}

				case "gallery": {
					for (let i = 0; i < selectMenu.options.length; i++) {
						i == 3
							? (selectMenu.options[i].default = true)
							: (selectMenu.options[i].default = false);
					}

					galleryPage = await ShinanoPaginator({
						interaction: interaction,
						interactorOnly: true,
						pages: galleryImagesEmbed,
						page: galleryPage,
						timeout: 120000,
						menu: navigation,
					});
					break;
				}
			}
		}

		collector.resetTimer();
	});

	collector.on("end", async (collected, reason) => {
		navigation.components[0].setDisabled(true);
		await interaction.editReply({ components: [navigation] });
	});
}

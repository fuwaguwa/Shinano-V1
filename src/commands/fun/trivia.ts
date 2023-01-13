import { Command } from "../../structures/Command";
import fetch from "node-fetch";
import {
	ButtonInteraction,
	InteractionCollector,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";

export default new Command({
	name: "trivia",
	description: "Trivia Questions!",
	cooldown: 5000,
	category: "Fun",
	options: [
		{
			required: true,
			type: "STRING",
			name: "category",
			description: "Category of the trivia question.",
			choices: [
				{ name: "Random Category", value: "random" },
				{ name: "Arts and Literature", value: "arts_and_literature" },
				{ name: "Film and TV", value: "film_and_tv" },
				{ name: "Food and Drink", value: "food_and_drink" },
				{ name: "General Knowledge", value: "general_knowledge" },
				{ name: "Geography", value: "geography" },
				{ name: "History", value: "history" },
				{ name: "Music", value: "music" },
				{ name: "Science", value: "science" },
				{ name: "Society and Culture", value: "society_and_culture" },
				{ name: "Sport and Leisure", value: "sport_and_leisure" },
			],
		},
		{
			required: true,
			type: "STRING",
			name: "difficulty",
			description: "Difficulty of the question.",
			choices: [
				{ name: "Random Difficulty", value: "random" },
				{ name: "Easy", value: "easy" },
				{ name: "Medium", value: "medium" },
				{ name: "Hard", value: "hard" },
			],
		},
	],
	run: async ({ interaction }) => {
		const categoryChoice: string = interaction.options.getString("category");
		const difficultyChoice: string =
			interaction.options.getString("difficulty");
		await interaction.deferReply();

		// Picking Category
		let category = categoryChoice;
		if (categoryChoice === "random") {
			const all_category = [
				"arts_and_literature",
				"film_and_tv",
				"food_and_drink",
				"general_knowledge",
				"geography",
				"history",
				"music",
				"science",
				"society_and_culture",
				"sport_and_leisure",
			];
			category = all_category[Math.floor(Math.random() * all_category.length)];
		}

		// Picking Difficulty
		let difficulty = difficultyChoice;
		if (difficultyChoice === "random") {
			const all_diff = ["easy", "medium", "hard"];
			difficulty = all_diff[Math.floor(Math.random() * all_diff.length)];
		}

		// Fetching Questions And Answers
		let response = await fetch(
			`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=${difficulty}`,
			{ method: "GET" }
		);
		let trivia = await response.json();

		let answers = [
			trivia[0]["correctAnswer"],
			trivia[0]["incorrectAnswers"][0],
			trivia[0]["incorrectAnswers"][1],
			trivia[0]["incorrectAnswers"][2],
		];

		console.log(`Trivia Answer: ${trivia[0]["correctAnswer"]}`);

		// Making sure they are under the text limit
		while (
			answers[0].length > 60 ||
			answers[1].length > 60 ||
			answers[2].length > 60 ||
			answers[3].length > 60
		) {
			response = await fetch(
				`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=${difficulty}`,
				{ method: "GET" }
			);
			trivia = await response.json();
			console.log(`Trivia Answer: ${trivia[0]["correctAnswer"]}`);

			answers = [
				trivia[0]["correctAnswer"],
				trivia[0]["incorrectAnswers"][0],
				trivia[0]["incorrectAnswers"][1],
				trivia[0]["incorrectAnswers"][2],
			];
		}

		// Generating 4 different number from the range of 1-4
		const randchoice = [];
		while (randchoice.length < 4) {
			const r = Math.floor(Math.random() * 4);
			if (randchoice.indexOf(r) === -1) randchoice.push(r);
		}

		// Randomising the answer
		const randomizedAnswers = {
			answer1: answers[randchoice[0]],
			answer2: answers[randchoice[1]],
			answer3: answers[randchoice[2]],
			answer4: answers[randchoice[3]],
		};

		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel(`${randomizedAnswers.answer1}`)
				.setStyle("PRIMARY")
				.setCustomId(`${randomizedAnswers.answer1}-${interaction.user.id}`),
			new MessageButton()
				.setLabel(`${randomizedAnswers.answer2}`)
				.setStyle("PRIMARY")
				.setCustomId(`${randomizedAnswers.answer2}-${interaction.user.id}`),
			new MessageButton()
				.setLabel(`${randomizedAnswers.answer3}`)
				.setStyle("PRIMARY")
				.setCustomId(`${randomizedAnswers.answer3}-${interaction.user.id}`),
			new MessageButton()
				.setLabel(`${randomizedAnswers.answer4}`)
				.setStyle("PRIMARY")
				.setCustomId(`${randomizedAnswers.answer4}-${interaction.user.id}`)
		);

		// Embed and Message
		const question = new MessageEmbed()
			.setAuthor({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				name: `${interaction.user.username}'s Trivia Question:`,
			})
			.setDescription(`${trivia[0]["question"]}\u200b\n\u200b`)
			.setColor("RANDOM")
			.addFields(
				{
					name: "Difficulty",
					value: `${trivia[0]["difficulty"].toUpperCase()}`,
					inline: true,
				},
				{
					name: "Category",
					value: `${trivia[0]["category"].toUpperCase()}`,
					inline: true,
				}
			)
			.setFooter({ text: "You have 15s to pick an answer!" });

		const message = await interaction.editReply({
			embeds: [question],
			components: [row],
		});
		const collector: InteractionCollector<ButtonInteraction> = await (
			message as Message
		).createMessageComponentCollector({
			componentType: "BUTTON",
			time: 15000,
		});

		collector.on("collect", async (i) => {
			const answer = i.customId.split("-")[0];

			// Filtering Response
			if (!i.customId.endsWith(i.user.id)) {
				return i.reply({
					content: "This button is not for you!",
					ephemeral: true,
				});
			}

			// Making the correct answer green, wrong one red and all of them to secondary
			await i.deferUpdate();
			if (answer === trivia[0]["correctAnswer"]) {
				for (let i = 0; i < 4; i++) {
					(row.components[i] as MessageButton).customId.split("-")[0] ===
					trivia[0]["correctAnswer"]
						? (row.components[i] as MessageButton)
								.setStyle("SUCCESS")
								.setDisabled(true)
						: (row.components[i] as MessageButton)
								.setStyle("SECONDARY")
								.setDisabled(true);
				}
				question.setColor("GREEN");

				collector.stop("End");
				await i.editReply({
					components: [row],
					embeds: [question],
					content: "You're correct!",
				});
			} else {
				for (let i = 0; i < 4; i++) {
					switch (true) {
						case (row.components[i] as MessageButton).customId.split("-")[0] ===
							trivia[0]["correctAnswer"]: {
							(row.components[i] as MessageButton)
								.setStyle("SUCCESS")
								.setDisabled(true);
							break;
						}

						case (row.components[i] as MessageButton).customId.split("-")[0] ===
							answer: {
							(row.components[i] as MessageButton)
								.setStyle("DANGER")
								.setDisabled(true);
							break;
						}

						default: {
							(row.components[i] as MessageButton)
								.setStyle("SECONDARY")
								.setDisabled(true);
							break;
						}
					}
				}

				question.setColor("RED");

				collector.stop("End");
				await i.editReply({
					components: [row],
					embeds: [question],
					content: `That was incorrect, the answer was \`${trivia[0]["correctAnswer"]}\`.`,
				});
			}
		});

		collector.on("end", async (collected, reason) => {
			// Timed Out
			if (reason && reason !== "End") {
				for (let i = 0; i < 4; i++) {
					(row.components[i] as MessageButton).customId.split("-")[0] ===
					trivia[0]["correctAnswer"]
						? (row.components[i] as MessageButton).setStyle("SUCCESS")
						: (row.components[i] as MessageButton).setStyle("SECONDARY");
					(row.components[i] as MessageButton).setDisabled(true);
				}

				question.setColor("RED");
				question.setFooter({ text: "Timed out!" });
				await interaction.editReply({
					components: [row],
					embeds: [question],
					content: `Timed out! The answer was \`${trivia[0]["correctAnswer"]}\`.`,
				});
			}
		});
	},
});

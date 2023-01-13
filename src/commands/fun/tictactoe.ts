import { Command } from "../../structures/Command";
import TTT from "discord-tictactoe";
const game = new TTT({ language: "en", commandOptionName: "user" });

export default new Command({
	name: "ttt",
	description: "Play tic tac toe against a bot or an user!",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			required: false,
			name: "user",
			description: "The user you want to play against.",
			type: "USER",
		},
	],
	run: async ({ interaction }) => {
		game.handleInteraction(interaction);
	},
});

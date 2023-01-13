import { Command } from "../../structures/Command";
import { shinanoInfo } from "./subcommands/shinano/info";
import { shinanoStats } from "./subcommands/shinano/stats";
import { shinanoSupport } from "./subcommands/shinano/support";
import { shinanoVote } from "./subcommands/shinano/vote";
import { shinanoPing } from "./subcommands/shinano/ping";
import { shinanoPat } from "./subcommands/shinano/pat";
import { shinanoHelpSFW } from "./subcommands/shinano/help-grp/sfw";
import { shinanoHelpNSFW } from "./subcommands/shinano/help-grp/nsfw";
import { shinanoLewd } from "./subcommands/shinano/lewd";

export default new Command({
	name: "shinano",
	description: "Information about Shinano.",
	cooldown: 4500,
	category: "Miscellaneous",
	options: [
		{
			type: "SUB_COMMAND",
			name: "info",
			description: "Show information about the Shinano.",
		},
		{
			type: "SUB_COMMAND",
			name: "stats",
			description: "Display Shinano's stats.",
		},
		{
			type: "SUB_COMMAND",
			name: "ping",
			description: "Show Shinano's ping.",
		},
		{
			type: "SUB_COMMAND",
			name: "vote",
			description: "Vote for Shinano or check your vote status!",
		},
		{
			type: "SUB_COMMAND",
			name: "support",
			description: "Run this command if you got any problem with Shinano!",
		},
		{
			type: "SUB_COMMAND",
			name: "pat",
			description: "Give me a headpat!",
		},
		{
			type: "SUB_COMMAND",
			name: "help",
			description: "All of Shinano's commands and what they do.",
			options: [
				{
					type: "STRING",
					required: true,
					name: "command-type",
					description: "The type of command.",
					choices: [
						{
							name: "Normal Commands",
							value: "sfw",
						},
						{
							name: "NSFW Commands",
							value: "nsfw",
						},
					],
				},
			],
		},
		{
			type: "SUB_COMMAND",
			name: "lewd",
			description: '"As a reward for your valiant efforts..."',
		},
	],
	run: async ({ interaction }) => {
		switch (interaction.options.getSubcommand()) {
			case "info": {
				await shinanoInfo(interaction);
				break;
			}

			case "stats": {
				await shinanoStats(interaction);
				break;
			}

			case "support": {
				await shinanoSupport(interaction);
				break;
			}

			case "ping": {
				await shinanoPing(interaction);
				break;
			}

			case "vote": {
				await shinanoVote(interaction);
				break;
			}

			case "pat": {
				await shinanoPat(interaction);
				break;
			}

			case "help": {
				const commandType: string =
					interaction.options.getString("command-type");
				if (commandType === "sfw") return await shinanoHelpSFW(interaction);
				return await shinanoHelpNSFW(interaction);
			}

			case "lewd": {
				await shinanoLewd(interaction);
				break;
			}
		}
	},
});

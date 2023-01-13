import { ShinanoInteraction } from "../../../../typings/Command";
import { blacklistAdd } from "./blacklist-grp/add";
import { blacklistCheck } from "./blacklist-grp/check";
import { blacklistRemove } from "./blacklist-grp/remove";

export async function devBlacklist(interaction: ShinanoInteraction) {
	switch (interaction.options.getSubcommand()) {
		case "add": {
			await blacklistAdd(interaction);
			break;
		}

		case "remove": {
			await blacklistRemove(interaction);
			break;
		}

		case "check": {
			await blacklistCheck(interaction);
			break;
		}
	}
}

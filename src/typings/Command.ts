import {
	ChatInputApplicationCommandData,
	CommandInteraction,
	CommandInteractionOptionResolver,
	GuildMember,
	MessageEmbed,
	PermissionResolvable,
} from "discord.js";
import { Shinano } from "../structures/Client";

export interface ShinanoInteraction extends CommandInteraction {
	member: GuildMember;
}

interface RunOptions {
	client: Shinano;
	interaction: ShinanoInteraction;
	args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => any;
export type CommandCategories =
	| "Anime"
	| "Fun"
	| "AzurLane"
	| "GenshinImpact"
	| "Miscellaneous"
	| "Utilities"
	| "Reactions"
	| "Image"
	| "NSFW";

export type CommandType = {
	userPermissions?: PermissionResolvable[];
	cooldown: number;
	nsfw?: boolean;
	ownerOnly?: boolean;
	voteRequired?: boolean;
	category: CommandCategories;
	run: RunFunction;
} & ChatInputApplicationCommandData;

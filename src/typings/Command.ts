import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable } from "discord.js";
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

export type CommandType = {
    userPermissions?: PermissionResolvable[];
    cooldown: number;
    nsfw?: boolean;
    ownerOnly?: boolean;
    voteRequired?: boolean;
    run: RunFunction;
} & ChatInputApplicationCommandData;

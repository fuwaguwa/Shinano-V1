import { Command } from "../../structures/Command";
import { Guild, GuildMember,  MessageEmbed, PermissionString,  User } from "discord.js";
import { toTitleCase } from "../../structures/Utils";
import { infoUser } from "./info-scmds/user";
import { infoGuild } from "./info-scmds/guild";

export default new Command({
    name: 'info',
    description: 'Get info about an user or the guild you are currently in.',
    cooldown: 4500,
    options: [
        {
            type:'SUB_COMMAND',
            name: 'user',
            description: 'Information about an user or yourself.',
            options: [
                {
                    type: 'USER',
                    name: 'user',
                    description: 'User.',
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'guild',
            description: 'Information about the guild you are currently in.',
        }
    ],
    run: async({interaction}) => {
        switch (interaction.options.getSubcommand()) {
            case 'user': {
                await infoUser(interaction)
                break
            }

            
            case 'guild': {
                await infoGuild(interaction)
                break
            }
        }
    }
})
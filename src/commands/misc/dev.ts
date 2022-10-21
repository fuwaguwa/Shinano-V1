import { Command } from "../../structures/Command";
import { devEval } from "./subcommands/dev/eval";
import { devLeave } from "./subcommands/dev/leave";
import { devUsage } from "./subcommands/dev/usage";
import { devBlacklist } from "./subcommands/dev/blacklist";
import { devVoteCheck } from "./subcommands/dev/vote-check";
import { devGuildInfo } from "./subcommands/dev/guildInfo";

export default new Command({
    name: 'dev',
    description: 'Dev Tools',
    defaultPermission: false,
    ownerOnly: true,
    cooldown: 5000,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'eval',
            description: 'N/A - Developer Only',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'code',
                    description: 'Code.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'usage',
            description: 'Shows bot memory usage.'
        },
        {
            type: 'SUB_COMMAND',
            name: 'leave',
            description: 'Make the bot leave a guild.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'guild-id',
                    description: 'Guild\'s ID'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'vote-check',
            description: "Check an user\'s vote",
            options: [
                {
                    type: 'USER',
                    required: true,
                    name: 'user',
                    description: 'User to vote check.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'guild-info',
            description: 'Get info about a guild.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'guild-id',
                    description: 'Guild ID.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'blacklist',
            description: 'hehe',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'add',
                    description: 'Add someone to the bot\'s blacklist.',
                    options: [
                        {
                            type: 'USER',
                            required: true,
                            name: 'user',
                            description: 'User\'s to blacklist.'
                        },
                        {
                            type: 'STRING',
                            required: true,
                            name: 'reason',
                            description: 'Reason for blacklist.'
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'remove',
                    description: 'Remove someone from the bot\'s blacklist.',
                    options: [
                        {
                            type: 'USER',
                            required: true,
                            name: 'user',
                            description: 'User\'s to unblacklist'
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'check',
                    description: 'Check if an user is blacklisted or not.',
                    options: [
                        {
                            type: 'USER',
                            required: true,
                            name: 'user',
                            description: 'User to the check in the blacklist.'
                        }
                    ]
                }
            ]
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        switch (interaction.options.getSubcommand()) {
            case 'eval': {
                await devEval(interaction)
                break
            }


            case 'leave': {
                await devLeave(interaction)
                break
            }


            case 'usage': {
                await devUsage(interaction)
                break
            }

            case 'vote-check': {
                await devVoteCheck(interaction)
                break
            }

            case 'guild-info': {
                await devGuildInfo(interaction)
                break
            }
        }
        

        const options = interaction.options
        if (options['_group']) {
            switch (interaction.options.getSubcommandGroup()) {
                case 'blacklist': {
                    await devBlacklist(interaction)
                    break
                }
            }
        }
    }
})

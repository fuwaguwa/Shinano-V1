import { Command } from "../../structures/Command";
import { botInfo } from "./subcommands/bot/info";
import { botStats } from "./subcommands/bot/stats";
import { botSupport } from "./subcommands/bot/support";
import { botUptime } from "./subcommands/bot/uptime";
import { botVote } from "./subcommands/bot/vote";
import { botPing } from "./subcommands/bot/ping";

export default new Command({
    name: 'bot',
    description: 'Information about the bot.',
    cooldown: 4500,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'info',
            description: 'Show information about the bot.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'stats',
            description: 'Display bot\'s stats.',
        },
        {
            type:'SUB_COMMAND',
            name: 'uptime',
            description: 'Show the bot\'s uptime.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'ping',
            description: 'Show the bot\'s ping.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'vote',
            description: 'Vote for the bot/Check your vote status!',
        },
        {
            type: 'SUB_COMMAND',
            name: 'support',
            description: 'Run this command if you got any problem with the bot!',
        }
    ],
    run: async({interaction}) => {
        switch (interaction.options.getSubcommand()) {
            case 'info':{
                await botInfo(interaction)
                break
            }


            case 'stats': {
                await botStats(interaction)
                break
            }


            case 'support': {
                await botSupport(interaction)
                break
            }


            case 'uptime': {
                await botUptime(interaction)
                break
            }


            case 'ping': {
                await botPing(interaction)
                break
            }

            
            case 'vote': {
                await botVote(interaction)
                break
            }
        }
    }
})

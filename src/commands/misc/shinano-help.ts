import { Command } from "../../structures/Command";
import { shinanoHelpNSFW } from "./subcommands/help/nsfw";
import { shinanoHelpSFW } from "./subcommands/help/sfw";

export default new Command({
    name: 'shinano-help',
    description: 'The list of all commands and what they do',
    cooldown: 4500,
    options: [
        {
            type: 'STRING',
            required: true,
            name: 'command-type',
            description: 'The type of command.',
            choices: [
                {
                    name: 'Normal Commands',
                    value: 'sfw'
                },
                {
                    name: 'NSFW Commands',
                    value: 'nsfw'
                }
            ]
        }
    ],
    run: async({interaction}) => {
        switch (interaction.options.getSubcommand()) {
            case 'sfw': {
                await shinanoHelpSFW(interaction)
                break
            }

            case 'nsfw': {
                await shinanoHelpNSFW(interaction)
                break
            }
        }
    }
})
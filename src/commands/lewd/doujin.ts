import { Command } from "../../structures/Command";
import { doujinCode } from "./subcommands/doujin/code";

export default new Command({
    name: 'doujin',
    description: 'Search up an doujin on the most popular doujin site.',
    nsfw: true,
    cooldown: 5000,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'code',
            description: 'Search up an doujin with the 6-digits code.',
            options: [
                {
                    type: 'INTEGER',
                    required: true,
                    name: 'doujin-code',
                    description: 'The doujin code.'
                }
            ]
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        switch (interaction.options.getSubcommand()) {
            case 'code': {
                await doujinCode(interaction)
                break
            }
        }
    }
})
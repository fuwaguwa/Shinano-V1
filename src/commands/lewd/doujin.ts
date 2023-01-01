import { Command } from "../../structures/Command";
import { doujinCode } from "./subcommands/doujin/code";
import { doujinRandom } from "./subcommands/doujin/random";
import { doujinSearch } from "./subcommands/doujin/search";

export default new Command({
    name: 'doujin',
    description: 'Search up an doujin on the most popular doujin site.',
    nsfw: true,
    cooldown: 5000,
    category: 'NSFW',
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
                    description: 'The doujin\'s code.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'search',
            description: 'Search up an doujin on the most popular H-manga website.',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'search-query',
                    description: 'Search query (title, artists, groups, tags, etc).'
                },
                {
                    type: 'STRING',
                    name: 'sorting',
                    description: 'The search sorting.',
                    choices: [
                        {name: 'Popular All-Time', value: 'popular'},
                        {name: 'Popular Weekly', value: 'popular-weekly'},
                        {name: 'Popular Today', value: 'popular-today'},
                        {name: 'Recent', value: 'recent'}
                    ]
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'random',
            description: 'Get a random doujin.'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        switch (interaction.options.getSubcommand()) {
            case 'code': {
                await doujinCode(interaction)
                break
            }

            case 'search': {
                await doujinSearch(interaction)
                break
            }

            case 'random': {
                await doujinRandom(interaction)
                break
            }
        }
    }
})
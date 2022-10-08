import { Command } from "../../structures/Command";
import { config } from "dotenv";
import { animeSearch } from "./anime-scmds/search";
import { animeCharacter } from "./anime-scmds/character";
import { animeRandom } from "./anime-scmds/random";
config();

export default new Command({
    name: 'anime',
    description: 'anime',
    cooldown: 4500,
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'search',
            description: 'Search up information of an anime on MyAnimeList',
            options: [
                {
                    type: 'STRING',
                    required: true,
                    name: 'name',
                    description: 'The anime\'s name.'
                },
                {
                    type: 'STRING',
                    required: true,
                    name: 'type',
                    description: 'The type of the anime',
                    choices: [
                        {name: 'TV', value: 'tv'},
                        {name: 'Movie', value: 'movie'},
                        {name: 'OVA (Original Video Animation)', value: 'ova'},
                        {name: 'ONA (Original Net Animation)', value: 'ona'}
                    ]
                }
           ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'character',
            description: 'Search up information of an anime character on MyAnimeList',
            options: [
                {
                    type: 'STRING',
                    required: true, 
                    name: 'name',
                    description: 'The character name.'
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'random',
            description: 'Return a random anime.'
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        switch (interaction.options.getSubcommand()) {
            case 'search': {
                await animeSearch(interaction);
                break
            }


            case 'character': {
                await animeCharacter(interaction);
                break
            }


            case 'random': {
                await animeRandom(interaction);
                break
            }
        }
    }
})

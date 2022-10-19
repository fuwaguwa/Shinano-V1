import { Command } from "../../structures/Command";
import { genshinCharacter } from "./genshin-scmds/character";

export default new Command({
    name: 'genshin',
    description: "Genshin Commands",
    cooldown: 5000,
    options: [
        {
            type: 'SUB_COMMAND_GROUP',
            name: 'character',
            description: 'character',
            options: [
                {
                    type: 'SUB_COMMAND',
                    name: 'info',
                    description: 'General information about a Genshin\'s character (General Info, Constellations, Ascension Costs).',
                    options: [
                        {
                            type: 'STRING',
                            required: true,
                            name: 'character-name',
                            description: 'The character\'s name.'
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'stats',
                    description: 'Stats of a Genshin\'s character.',
                    options: [
                        {
                            type: 'STRING',
                            required: true,
                            name: 'character-name',
                            description: 'The character\'s name.'
                        },
                        {
                            type: 'INTEGER',
                            required: true,
                            name: 'character-level',
                            description: 'The character\'s level.'
                        }, 
                        {
                            type: 'STRING',
                            name: 'ascension-phase',
                            description: 'The character\'s ascension phase.',
                            choices: [
                                {name: '1', value: '1'},
                                {name: '2', value: '2'},
                                {name: '3', value: '3'},
                                {name: '4', value: '4'},
                                {name: '5', value: '5'},
                                {name: '6', value: '6'},
                            ]
                        }
                    ]
                },
                {
                    type: 'SUB_COMMAND',
                    name: 'talents',
                    description: 'Get information about a Genshin\'s character talents (General Info, Talent Costs).',
                    options: [
                        {
                            type: 'STRING',
                            required: true,
                            name: 'character-name',
                            description: 'The character\'s name (Tip: Use \'Traveler <Element>\' for the info on the Traveler)'
                        }
                    ]
                }
            ]
        }
    ],
    run: async({interaction}) => {
        await interaction.deferReply()
        if (interaction.options['_group']) {
            switch (interaction.options.getSubcommandGroup()) {
                case 'character': {
                    await genshinCharacter(interaction)
                    break
                }
            }
        }
    }
})
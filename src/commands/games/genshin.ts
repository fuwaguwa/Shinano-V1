import { Command } from "../../structures/Command";
import { genshinCharacter } from "./genshin-scmds/character";
import { Element } from "../../typings/Genshin";


const elementColors: Element = {
    "Pyro": "#b7242a",
    "Hydro": "#248fbd",
    "Anemo": "#2a9d90",
    "Electro": "#7553c3",
    "Dendro": "#6cae22",
    "Cryo": "#7ba6db",
    "Geo": "#e5a659"
}

const elementIcons: Element = {
    "Pyro": "<:pyro:1003213063199133759>",
    "Hydro": "<:hydro:1003213061575954442>",
    "Anemo": "<:anemo:1003213059394895922>",
    "Electro": "<:electro:1003213057046102037>",
    "Dendro": "<:dendro:1003213054634377216>",
    "Cryo": "<:cryo:1003213052579164200>",
    "Geo": "<:geo:1003213050561699897>"
}        


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
                    description: 'General information about a Genshin\'s character.',
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
                    name: 'costs',
                    description: 'Information about Genshin\'s character talents and ascensions costs.',
                    options: [
                        {
                            type: 'STRING',
                            required: true,
                            name: 'character-name',
                            description: 'The character\'s name.'
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
                    await genshinCharacter(interaction, elementColors, elementIcons)
                    break
                }
            }
        }
    }
})
import { Command } from "../../structures/Command";
import { InteractionCollector, Message, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js";
import { ShinanoPaginator } from "../../structures/Pages";
import { helpSFW } from "./help-scmds/sfw";
import { helpNSFW } from "./help-scmds/nsfw";

export default new Command({
    name: 'help',
    description: 'Send a list of commands',
    cooldown: 4500,
    options: [
        {
            type: 'STRING',
            required: true,
            name: 'type',
            description: 'Type of commands.',
            choices: [
                {name: 'Normal Commands', value: 'sfw'},
                {name: 'NSFW Commands', value: 'nsfw'}
            ]
        },
    ],
    run: async({interaction}) => {
        switch (interaction.options.getString('type')) {
            case 'sfw': {
                await helpSFW(interaction)
                break
            }

            
            case 'nsfw': {
                await helpNSFW(interaction)
                break
            }
        }
    }
})

import { CommandInteractionOptionResolver, Collection, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ShinanoInteraction } from "../typings/Command";
import Blacklist from '../schemas/Blacklist'
import {config} from 'dotenv'
import ms from 'ms'
import { checkVotes } from "../structures/Utils";
config();

const Cooldown: Collection<string, number> = new Collection()
const owner = '836215956346634270'


export default new Event("interactionCreate", async (interaction) => {
    if (!interaction.guild) return;
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({content: "This command no longer exists!", ephemeral: true});

        if (command.cooldown) {
            // Cooldown Check
            if (Cooldown.has(`${command.name}${owner}`)) Cooldown.delete(`${command.name}${owner}`);

            if (Cooldown.has(`${command.name}${interaction.user.id}`)) {
                const cms = Cooldown.get(`${command.name}${interaction.user.id}`)
                const onChillOut = new MessageEmbed()
                    .setTitle('Slow Down!')
                    .setColor('RED')
                    .setDescription(`You are on a \`${ms(cms - Date.now(), {long : true})}\` cooldown.`)
                return interaction.reply({embeds:[onChillOut], ephemeral:true})
            }

            
            // Blacklist
            const blacklist = await Blacklist.findOne({userId: interaction.user.id})
            if (blacklist) {
                const blacklisted = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('You have been blacklisted!')
                    .addFields(
                        {name: 'Reason', value: blacklist['reason']},
                        {name: 'Blacklisted By:', value: `<@${blacklist['blacklistedBy']}>`}
                    )
                return interaction.reply({embeds: [blacklisted]})
            }


            // NSFW Check
            if (command.nsfw == true) {
                if (!(interaction.channel as TextChannel).nsfw) {
                    const nsfwCommand: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('NSFW Command')
                        .setDescription('NSFW commands can only be used in NSFW channels.')
                    return interaction.deferred ? interaction.editReply({embeds: [nsfwCommand]}) : interaction.reply({embeds: [nsfwCommand], ephemeral: true})
                }


                // Vote Checking
                if (interaction.user.id !== owner) {
                    const voteStatus = await checkVotes(interaction.user.id)

                    const voteEmbed: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Hold on...')
                        .setImage('https://i.imgur.com/ca5zzXB.png')
                    const voteLink: MessageActionRow = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setStyle('LINK')
                                .setLabel('Vote for Shinano!')
                                .setEmoji('<:topgg:1002849574517477447>')
                                .setURL('https://top.gg/bot/1002193298229829682/vote'),
                            new MessageButton()
                                .setStyle('SECONDARY')
                                .setLabel('Check Vote')
                                .setCustomId('VOTE-CHECK')
                                .setEmoji('🔎')
                        )
                    
                    // Checking if user exist.
                    if (voteStatus == 0) {
                        voteEmbed
                            .setDescription(
                                `To **use NSFW commands**, you'll have to **vote for Shinano on top.gg** using the button below!\n` +
                                `It only takes **a few seconds to vote**, after which you will have access to **premium quality NSFW commands until you are able vote again (12 hours!)**\n\n` +
                                `Run the \`/support\` command if you have any problem with voting!`
                            )
                    
                        return interaction.deferred 
                            ? interaction.editReply({embeds: [voteEmbed], components: [voteLink]}) 
                            : interaction.reply({embeds: [voteEmbed], components: [voteLink]})
                    }
                }
            }


            // Owner Check
            if (command.ownerOnly == true) {
                if (owner !== interaction.user.id) {
                    const notForYou: MessageEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('This command is for owners only!')
                    return interaction.deferred ? interaction.editReply({embeds: [notForYou]}) : interaction.reply({embeds: [notForYou], ephemeral: true})
                }
            }

            // Command Run
            command.run({
                args: interaction.options as CommandInteractionOptionResolver,
                client,
                interaction: interaction as ShinanoInteraction
            });


            // Apply Cooldown
            Cooldown.set(`${command.name}${interaction.user.id}`, Date.now() + command.cooldown)
            setTimeout(() => {
                Cooldown.delete(`${command.name}${interaction.user.id}`)
            }, command.cooldown)
        }


        // Logging
        if (interaction.user.id === owner) return;

        const mainGuild = await client.guilds.fetch('1002188088942022807')
        const commandLogsChannel = await mainGuild.channels.fetch('1002189434797707304')


        let fullCommand = interaction.commandName
        const options: any = interaction.options
        if (options._group) fullCommand = fullCommand + ' ' + options._group;
        if (options._subcommandw) fullCommand = fullCommand + ' ' + options._subcommand
        if (options._hoistedOptions.length > 0) {
            options._hoistedOptions.forEach((option) => {
                option.attachment
                    ? fullCommand = fullCommand + ' ' + `${option.name}:${option.attachment.proxyURL}`
                    : fullCommand = fullCommand + ' ' + `${option.name}:${option.value} `
            })
        }
        
        const commandExecuted: MessageEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`Command Executed!`)
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: 'Command Name: ', value: `\`/${fullCommand}\``},
                {name: 'Guild Name | Guild ID', value: `${interaction.guild.name} | ${interaction.guild.id}`},
                {name: `Channel Name | Channel ID`, value: `#${interaction.channel.name} | ${interaction.channel.id}`},
                {name: `User | User ID`, value: `${interaction.user.username}#${interaction.user.discriminator} | ${interaction.user.id}`},
            )
            .setTimestamp()
        await (commandLogsChannel as TextChannel).send({
            embeds: [commandExecuted]
        })
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'NONSFW') {
            const cantsee: MessageEmbed = new MessageEmbed()
                .setColor('BLUE')
                .setTitle('Enabling The NSFW Commands')
                .addFields(
                    {
                        name: 'For Normal Members',
                        value: 'Shinano\'s `/nsfw` commands are **disabled by default** to keep the command list clean in non-NSFW channels. If you want to use them, please ask a moderator/administrator to read the section below.'
                    },
                    {
                        name: 'For Moderators/Administrators',
                        value: 
                        'As said above, `/nsfw` command is **disabled by default**, meaning only people with **Administrator/Manage Webhooks** permission can use the command!\n\n' +
                        'If you want to **enable it for normal members**:\n' +
                        'Go to **Server Settings** > **Integrations** > **Shinano** > Search for `nsfw` > Enable it for **roles** and **channels** you want.'
                    }
                )
                .setImage('https://cdn.upload.systems/uploads/xI7OxDPg.gif')
            return interaction.reply({embeds: [cantsee], ephemeral: true})
        }
        
        if (interaction.customId === 'VOTE-CHECK') {
            const voteStatus = await checkVotes(interaction.user.id)
            const voteLink: MessageActionRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel('Vote for Shinano!')
                        .setEmoji('<:topgg:1002849574517477447>')
                        .setURL('https://top.gg/bot/1002193298229829682/vote'),
                )


            if (voteStatus == 0) {
                const noVotes: MessageEmbed = new MessageEmbed()
                    .setTitle('Voting Status')
                    .setDescription('You haven\'t voted for Shinano today! Please vote using the button below!')
                    .setColor('RED')
                    .setFooter({text: 'You can vote every 12 hours!'})
                    .setTimestamp()
                return interaction.reply({embeds: [noVotes], components: [voteLink], ephemeral: true})
            } else {
                const votingStatus: MessageEmbed = new MessageEmbed()
                    .setTitle('Voting Status')
                    .setTimestamp()
                    .setColor('GREEN')
                    .setDescription(`You have voted for Shinano! Thank you for the support!`)
                    .setFooter({text: 'You can vote every 12 hours!'})
                return interaction.reply({embeds: [votingStatus], ephemeral: true})
                
            }
        }
        
    }
});

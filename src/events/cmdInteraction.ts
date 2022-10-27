import { CommandInteractionOptionResolver, Collection, MessageEmbed, TextChannel, MessageActionRow, MessageButton } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ShinanoInteraction } from "../typings/Command";
import Blacklist from '../schemas/Blacklist'
import { config } from 'dotenv'
import ms from 'ms'
import Votes from '../schemas/Votes'
config();

const Cooldown: Collection<string, number> = new Collection()
const owner = '836215956346634270'


export default new Event("interactionCreate", async (interaction) => {
    if (!interaction.guild) return;
    if (!interaction.isCommand()) return;

    
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.reply({content: "This command no longer exists!", ephemeral: true});


    // Cooldown
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
            if (command.voteRequired == true) {
                if (interaction.user.id !== owner && interaction.guild.id !== '1020960562710052895') {
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
                        
                    // Checking if user has voted
                    const userVotes = await Votes.findOne({userId: interaction.user.id})
                    if (!userVotes) {
                        // Have not voted before
                        voteEmbed
                            .setDescription(
                                `To **use NSFW commands**, you'll have to **vote for Shinano on top.gg** using the button below!\n` +
                                `It only takes **a few seconds to vote**, after which you will have access to **premium quality NSFW commands until you are able vote again (12 hours!)**\n\n` +
                                `Run the \`/support\` command if you have any problem with voting!`
                            )
                    
                        return interaction.deferred 
                            ? interaction.editReply({embeds: [voteEmbed], components: [voteLink]}) 
                            : interaction.reply({embeds: [voteEmbed], components: [voteLink]})
                    } else if (Math.floor(Date.now() / 1000) - userVotes.voteTimestamp > 43200) {
                        // Voted before but 12 hours has passed
                        voteEmbed
                            .setDescription(
                                `Your **12 hours** access to NSFW commands ran out!\n` +
                                `Please **vote again** if you want to continue using **Shinano's NSFW features**`
                            )
                            return interaction.deferred 
                                ? interaction.editReply({embeds: [voteEmbed], components: [voteLink]}) 
                                : interaction.reply({embeds: [voteEmbed], components: [voteLink]})
                    }
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
    if (options._subcommand) fullCommand = fullCommand + ' ' + options._subcommand
    if (options._hoistedOptions.length > 0) {
        options._hoistedOptions.forEach((option) => {
            option.attachment
                ? fullCommand = `${fullCommand} ${option.name}:${option.attachment.proxyURL}`
                : fullCommand = `${fullCommand} ${option.name}:${option.value}`
        })
    }
    
    const commandExecuted: MessageEmbed = new MessageEmbed()
        .setColor('#2f3136')
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
});

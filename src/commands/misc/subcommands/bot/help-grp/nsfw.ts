import { TextChannel, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShinanoInteraction } from "../../../../../typings/Command";

export async function botHelpNSFW(interaction: ShinanoInteraction) {
    // NSFW Check 
    if (!(interaction.channel as TextChannel).nsfw) {
        const nsfwErrorEmbed = new MessageEmbed()
            .setColor('RED')
            .setTitle('NSFW Command')
            .setDescription('NSFW commands can only be used in NSFW channels!')
        return interaction.reply({embeds: [nsfwErrorEmbed], ephemeral: true})
    }

    const navigation: MessageActionRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle('SECONDARY')
                .setLabel('Can\'t see NSFW commands?')
                .setCustomId('NONSFW')
        )

    const nsfwEmbed = new MessageEmbed()
        .setTitle('NSFW Commands')
        .setColor('BLUE')
        .setDescription('Tip: You can quickly type `/<tag>` or `/<category>` for the commands. E.g `/random`, `/irl`')
        .setFields(
            {
                name: 'Sauce Lookup Command:',
                value: '`sauce`'
            },
            {
                name: 'Porn Commands:',
                value: "`ass`, `a-level (anal)`, `breasts`, `cosplay`, `head (blowjob)`, `random`, `minge (pussy)`, `video`"
            },
            {
                name: 'Hentai Commands:',
                value: "`ass`, `a-level (anal)`, `bomb`, `breasts`, `feet`, `gif`, `head (blowjob)`, `nekomimi`, `minge (pussy)`, `random`, `succubus`, `thighs`"
            },
            {
                name: "Private Collection (High-Quality):",
                value: "`elf`, `genshin`, `kemonomimi`, `misc`, `shipgirls`, `undies`, `vtubers`, `yuri`"
            }
        )
    await interaction.reply({embeds:[nsfwEmbed], components: [navigation]})
}
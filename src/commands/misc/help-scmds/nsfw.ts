import { TextChannel, MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { ShinanoInteraction } from "../../../typings/Command";

export async function helpNSFW(interaction: ShinanoInteraction) {
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
        .setDescription('Tip: You can quickly type `/<tag>` or `/<category>` for the commands. E.g `/random`, `/porn`')
        .setFields(
            {name: 'Sauce Lookup Command:', value: '`/sauce`'},
            {name: "/nsfw hentai <tag>", value:"`anal`, `ass`, `blowjob`, `bomb`, `boobs`, `cum`, `elf`, `feet`, `genshin`, `gif`, `kemonomimi`, `masturbation`, `nekomimi`, `paizuri`, `pussy`, `random`, `shipgirls`, `succubus`, `thighs`, `undies`, `vtubers`, `yuri`"},
            {name: "/nsfw porn <tag>", value: "`anal`, `ass`, `blowjob`, `boobs`, `cosplay`,`cum`, `random`, `pussy`, `video`"},
        )
    await interaction.reply({embeds:[nsfwEmbed], components: [navigation]})
}
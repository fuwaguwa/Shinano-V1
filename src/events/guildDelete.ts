import { Guild, MessageEmbed, TextChannel } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { config } from "dotenv";
import { updateServerCount } from "../structures/Utils";
config();

export default new Event(('guildDelete'), async (guild) => {
    if (guild.id === '1004919883387121664') return;
    const mainGuild: Guild = await client.guilds.fetch('1002188088942022807')
    const IOChannel = await mainGuild.channels.fetch('1017463107737628732')

    const kickedEmbed: MessageEmbed = new MessageEmbed()
        .setColor('RED')
        .setTitle('Bot Removed From Guild!')
        .setTimestamp()
        .addField('Guild Name | Guild ID', `${guild.name} | ${guild.id}`)
    await (IOChannel as TextChannel).send({embeds: [kickedEmbed]})


    await updateServerCount();
})
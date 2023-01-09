import { ShinanoInteraction } from "../../../../typings/Command";
import genshin from 'genshin-db'
import { MessageEmbed } from "discord.js";
import { toTitleCase } from "../../../../lib/Utils";
import { rarityColor } from "../../../../lib/Genshin";

export async function genshinMaterial(interaction: ShinanoInteraction) {
    // Fetching info
    const name: string = interaction.options.getString('material-name').toLowerCase()
    const material: genshin.Material = genshin.materials(name)

    if (!material) {
        const noResult: MessageEmbed = new MessageEmbed()
            .setColor('RED')
            .setDescription('❌ | No material found!')
        return interaction.editReply({embeds: [noResult]})
    }


    // Outputting Data
    const materialEmbed: MessageEmbed = new MessageEmbed()
        .setColor(material.rarity ? rarityColor(material) : '#2f3136')
        .setTitle(material.name)
        .setThumbnail(material.images.redirect)
        .setDescription(`*${material.description}*\n\n${material.url ? `[Wiki Link](${material.url.fandom})` : ""}`)
        .addFields(
            {
                name: 'Material Category:',
                value: toTitleCase(material.category.split('_').join(' ').toLowerCase())
            },
            {
                name: 'Material Type:',
                value: material.materialtype
            }
        )
    if (!material.daysofweek) {
        materialEmbed
            .addField(
                'Material Source:',
                material.source.join("\n")
            )
    } else {
        materialEmbed
            .addField(
                'Material Source',
                `${material.source.join("\n")}\n` +
                `${material.dropdomain} (${material.daysofweek.join("/")})`
            )
    }
    await interaction.editReply({embeds: [materialEmbed]})
}
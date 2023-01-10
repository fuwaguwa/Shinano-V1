import { MessageEmbed, MessageActionRow, MessageButton, ButtonInteraction, SelectMenuInteraction, InteractionCollector, MessageComponentInteraction, Message, MessageSelectMenu } from "discord.js";
import { ShinanoInteraction } from "../typings/Command";


export async function ShinanoPaginator(options: {
    interaction: ShinanoInteraction | ButtonInteraction | SelectMenuInteraction, 
    pages: MessageEmbed[],
    page?: number
    interactorOnly: boolean,
    menu?: MessageActionRow,
    timeout: number,
}): Promise<number> {
    return new Promise(async (resolve, reject) => {
        let pageCount: number = options.page || 0
        let menuId: string;

        if (options.menu) menuId = (options.menu.components[0] as MessageSelectMenu).customId.split('-')[0];
        if (options.interaction.deferred == false) await options.interaction.deferReply();
    
    
        // Buttons
        let navigation = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('<:FIRST:1002197527732437052>')
                    .setDisabled(true)
                    .setCustomId(`FIRST-${options.interaction.user.id}`),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('<:LEFT:1002197531335327805>')
                    .setDisabled(true)
                    .setCustomId(`BACK-${options.interaction.user.id}`),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                    .setCustomId('pagecount')
                    .setLabel(`Page: ${pageCount + 1}/${options.pages.length}`),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('<:RIGHT:1002197525345865790>')
                    .setCustomId(`NEXT-${options.interaction.user.id}`),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setEmoji('<:LAST:1002197529095577612>')
                    .setCustomId(`LAST-${options.interaction.user.id}`)
            )
        

        // Modifying button state based on pages
        if (options.pages.length == 1) {
            for (let i = 0; i < navigation.components.length; i++) {
                (navigation.components[i] as MessageButton).setStyle('SECONDARY').setDisabled(true);
            }
        } else if (options.pages.length == pageCount) {
            (navigation.components[3] as MessageButton).setStyle('SECONDARY').setDisabled(true);
            (navigation.components[4] as MessageButton).setStyle('SECONDARY').setDisabled(true);
        } else {
            for (let i = 0; i < navigation.components.length; i++) {
                if (i == 2) continue
                (navigation.components[i] as MessageButton).setDisabled(false);
            }
        }

    
        let message;
        if (options.menu) {
            message = await options.interaction.editReply({
                embeds: [options.pages[pageCount]],
                components: [options.menu, navigation]
            })
        } else {
            message = await options.interaction.editReply({
                embeds: [options.pages[pageCount]],
                components: [navigation]
            })
        }
    
        
        const collector: InteractionCollector<MessageComponentInteraction> = await (message as Message).createMessageComponentCollector({
            time: options.timeout
        })
        
        collector.on('collect', async (i) => {
            const customId = i.customId.split('-')[0]

    
            // Reset page count on menu update
            if (customId === menuId) {
                resolve(pageCount)
                pageCount = 0
                return collector.stop('interaction ended') // Ending paginator for that menu option
            } 
    
    
            if (options.interactorOnly) {
                if (i.customId.split('-')[1] !== i.user.id) {
                    return i.reply({
                        content: 'This button is not for you!',
                        ephemeral: true
                    })
                }
            }
    
            switch (customId) {
                case 'BACK': {
                    pageCount = pageCount - 1
                    break
                }
    
    
                case 'NEXT': {
                    pageCount = pageCount + 1
                    break
                }
    
    
                case 'FIRST': {
                    pageCount = 0
                    break
                }
    
    
                case 'LAST': {
                    pageCount = options.pages.length - 1
                    break
                }
                
                
            }


            // Editing the buttons and page
            await i.deferUpdate();
            (navigation.components[2] as MessageButton).setLabel(`Page: ${pageCount + 1}/${options.pages.length}`);
    
            
            
            if (pageCount == 0) { // On the first page
                (navigation.components[0] as MessageButton).setDisabled(true); // First Button
                (navigation.components[1] as MessageButton).setDisabled(true); // Back Button
    
                (navigation.components[3] as MessageButton).setDisabled(false); // Next Button
                (navigation.components[4] as MessageButton).setDisabled(false); // Last Button
            } 
    
            if (pageCount != 0 && pageCount != options.pages.length - 1) { // On normal pages
                (navigation.components[0] as MessageButton).setDisabled(false); // First Button
                (navigation.components[1] as MessageButton).setDisabled(false); // Back Button
    
                (navigation.components[3] as MessageButton).setDisabled(false); // Next Button
                (navigation.components[4] as MessageButton).setDisabled(false); // Last Button
            }
            
            if (pageCount == options.pages.length - 1) { // On the last page
                (navigation.components[0] as MessageButton).setDisabled(false); // First Button
                (navigation.components[1] as MessageButton).setDisabled(false); // Back Button
    
                (navigation.components[3] as MessageButton).setDisabled(true); // Next Button
                (navigation.components[4] as MessageButton).setDisabled(true); // Last Button
            }
    
            
            if (options.menu) {
                await i.editReply({
                    embeds: [options.pages[pageCount]],
                    components: [options.menu, navigation]
                })
            } else {
                await i.editReply({
                    embeds: [options.pages[pageCount]],
                    components: [navigation]
                })
            }
            
            collector.resetTimer()
        })
    
    
        // Timeout
        collector.on('end', async (collected, reason) => {
            if (reason === 'messageDelete' || reason === 'interaction ended') return;
    
            if (options.menu) {
                options.menu.components[0].setDisabled(true);
                for (let i = 0; i < navigation.components.length; i++) {
                    (navigation.components[i] as MessageButton).setStyle('SECONDARY').setDisabled(true);
                }
                
                await options.interaction.editReply({
                    components: [options.menu, navigation]
                })
    
            } else {
                for (let i = 0; i < navigation.components.length; i++) {
                    (navigation.components[i] as MessageButton).setStyle('SECONDARY').setDisabled(true);
                }
                
                await options.interaction.editReply({
                    components: [navigation]
                })
            }
        })
    })

}
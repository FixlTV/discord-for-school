const discord = require('discord.js')

module.exports = {
    id: 'main_menu',
    execute: async (ita, client) => {
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Hauptmenü')
            .setDescription('Willkommen im Hauptmenü\nHier kannst du anstehende Termine einsehen und deine Einstellungen verwalten.')
            .setFooter('Verwende die Knöpfe um fortzufahren.')
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('user_homework')
                    .setLabel('Hausaufgaben')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('user_tests')
                    .setLabel('Tests [WIP]')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
                new discord.MessageButton()
                    .setCustomId('notification_hub')
                    .setLabel('Benachrichtigungen')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('user_settings')
                    .setLabel('Einstellungen')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setLabel('Hilfe')
                    .setStyle('LINK')
                    .setURL('https://github.com/FixlTV/discord-for-school/wiki')
            )
        if(ita.customId.split('!')[1] == 'send') await ita.reply({ embeds: [embed], ephemeral: true, components: [buttons] })
        else ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
    }
}
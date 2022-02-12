const discord = require('discord.js')

module.exports = {
    id: 'notification_hub',
    execute: async (ita, client) => {
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Benachrichtigungen')
            .setDescription('Willkommen im Notification-Hub\nHier kannst du alle Benachrichtigungen einsehen und deine Einstellungen verwalten.')
            .setFooter('Verwende die Knöpfe um fortzufahren.')
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('main_menu')
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId('show_notifications')
                    .setLabel('Entgangene Benachrichtigungen')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('notification_settings!hub')
                    .setLabel('Benachrichtigungs-Einstellungen')
                    .setStyle('SECONDARY')
            )
        await ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
    }
}
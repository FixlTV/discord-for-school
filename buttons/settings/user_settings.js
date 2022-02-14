const discord = require('discord.js')

module.exports = {
    id: 'user_settings',
    execute: async (ita, client) => {
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Einstellungen')
            .setDescription('Hier kannst du deine Einstellungen verwalten (Weitere Folgen irgendwann)')

        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('main_menu')
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId('ignored_subjects')
                    .setLabel('Ignorierte Fächer')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId('notification_settings!settings')
                    .setLabel('Benachrichtigungen')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )
        if(require('../../config.json').mods?.includes(ita.user.id)) buttons.addComponents(
            new discord.MessageButton()
                .setCustomId('dev_settings')
                .setLabel('Entwickler-Einstellungen')
                .setStyle('SECONDARY')
        )
        await ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
    }
}
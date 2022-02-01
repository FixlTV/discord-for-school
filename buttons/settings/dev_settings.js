const discord = require('discord.js')

module.exports = {
    id: 'dev_settings',
    execute: async (ita, client) => {
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Entwickler-Einstellungen')
            .setDescription('Hier kannst du die Entwicklungs-Einstellungen verwalten.')
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('user_settings')
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId('dev_settings_update')
                    .setLabel('Update')
                    .setStyle('SECONDARY')
            )
        await ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
    }
}
const discord = require('discord.js')
const fs = require('fs/promises')

module.exports = {
    id: 'notification_settings',
    execute: async (ita, client) => {
        const userdata = require('../../data/userdata.json')
        if(!userdata[ita.user.id]?.notifications?.status && userdata[ita.user.id]?.notifications?.status != 0) {
            userdata[ita.user.id] = Object.assign(userdata[ita.user.id] || {}, { notifications: { status: 0 }})
            await fs.writeFile('data/userdata.json', JSON.stringify(userdata))
        }
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Benachrichtigungs-Einstellungen')
            .setDescription('Wähle die zu ändernde Option aus oder drücke den <:power:880392747020861480> Knopf, um alle Benachrichtigungen zu ')
            .setFooter('Verwende die Knöpfe um fortzufahren.')
        if(ita.customId.split('!').includes('toggle')) {
            userdata[ita.user.id].notifications.status ^= 0b001
            if(userdata[ita.user.id].notifications.status & 0b001) embed.setFooter('Du erhältst nun Benachrichtigungen.')
            else embed.setFooter('Du erhältst nun keine Benachrichtigungen mehr.')
            await fs.writeFile('data/userdata.json', JSON.stringify(userdata))
        }
        if(userdata[ita.user.id].notifications.status & 0b001) embed.setDescription(embed.description + 'deaktivieren.')
        else embed.setDescription(embed.description + 'aktivieren.')
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId((() => {
                        if(ita.customId.split('!')[1] == 'hub') return 'notification_hub'
                        else return 'user_settings'
                    })())
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId(`notification_settings!${ita.customId.split('!')[1]}!toggle`)
                    .setStyle((() => {
                        if(userdata[ita.user.id].notifications.status & 0b001) return 'SUCCESS'
                        return 'DANGER'
                    })())
                    .setEmoji('<:power:880392747020861480>'),
                new discord.MessageButton()
                    .setCustomId(`notification_settings_time!${ita.customId.split('!')[1]}`)
                    .setLabel('Benachrichtigungs-Zeiten')
                    .setStyle('SECONDARY'),
                new discord.MessageButton()
                    .setCustomId(`notification_settings_types!${ita.customId.split('!')[1]}`)
                    .setLabel('Benachrichtigungsauslöser')
                    .setStyle('SECONDARY')
            )
        await ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
    }
}
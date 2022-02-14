const discord = require('discord.js')
const fs = require('fs/promises')
const { sendtime } = require('../../../config.json')

module.exports = {
    id: 'notification_settings_time',
    execute: async (ita, client) => {
        const user = ita.user
        const userdata = require('../../../data/userdata.json')
        user.data = userdata[user.id]
        if(!user.data.notifications.time) user.data.notifications.time = [parseInt(sendtime)]
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Benachrichtigungs-Einstellungen')
            .setDescription('Wähle die Zeit(en) aus, zu denen du deine Benachrichtigungen (für den nächsten Tag) erhalten möchtest.')

        let options = []
        for(let i = 0; i <= 23; i++) {
            let option = {}
            option.label = `${i}:00 Uhr`
            if(i == sendtime) option.description = 'Standard-Zeit'
            if(user.data.notifications.time.includes(i)) option.default = true
            option.value = i.toString()
            options.push(option)
        }
        
        let selectMenu = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('notification_settings_time_select')
                    .setMaxValues(24)
                    .setPlaceholder('Wähle eine oder mehrere Stunden aus')
                    .addOptions(options)
                )

        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId(`notification_settings!${ita.customId.split('!')[1]}`)
                    .setLabel('❮')
                    .setStyle('DANGER')
            )

        await ita.update({ embeds: [embed], components: [selectMenu, buttons] })
        const collector = ita.message.createMessageComponentCollector({time: 900000})

        collector.on('collect', async (interaction) => {
            if(interaction.customId != 'notification_settings_time_select') return collector.stop()
            user.data.notifications.time = interaction.values.map(o => parseInt(o))
            await fs.writeFile('data/userdata.json', JSON.stringify(userdata))

            options = []
            for(let i = 0; i <= 23; i++) {
                let option = {}
                option.label = `${i}:00 Uhr`
                if(i == sendtime) option.description = 'Standard-Zeit'
                if(user.data.notifications.time.includes(i)) option.default = true
                option.value = i.toString()
                options.push(option)
            }

            let selectMenu = new discord.MessageActionRow()
                .addComponents(
                    new discord.MessageSelectMenu()
                        .setCustomId('notification_settings_time_select')
                        .setMaxValues(24)
                        .setPlaceholder('Wähle eine oder mehrere Stunden aus')
                        .addOptions(options)
                    )
            
            await interaction.update({ embeds: [embed.setFooter('Eingabe gespeichert.')], components: [selectMenu, buttons], ephemeral: true })
        })
    }
}
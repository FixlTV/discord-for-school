const discord = require('discord.js')
const fs = require('fs/promises')

module.exports = {
    id: 'notification_settings_types',
    execute: async (ita, client) => {
        const { user } = ita
        user.data = require('../../../data/userdata.json')[user.id]
        if(!user.data.notifications.types) user.data.notifications.types = { hw: [], test: [] }

        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Benachrichtigungs-Einstellungen')
            .setDescription('Wähle im oberen Formular aus, wann du Erinnerungen zu fälligen Hausaufgaben bekommen willst und im unteren Formular, wann du Benachrichtigungen zu Tests bekommst.')

        let hwOptions = []
        for(let i = 1; i <= 14; i++) {
            let option = {}
            option.label = `${i} Tage vorher`.replace('1 Tage', '1 Tag')
            option.value = i.toString()
            if(user.data.notifications.types.hw.includes(i)) option.default = true
            hwOptions.push(option)
        }

        let testOptions = []
        for(let i = 1; i <= 14; i++) {
            let option = {}
            option.label = `${i} Tage vorher`.replace('1 Tage', '1 Tag')
            option.value = i.toString()
            if(user.data.notifications.types.test.includes(i)) option.default = true
            testOptions.push(option)
        }

        let hwMenu = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('notification_types_hw')
                    .setPlaceholder('Hausaufgaben')
                    .addOptions(hwOptions)
                    .setMaxValues(14)
            )
        let testMenu = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .setCustomId('notification_types_test')
                    .setPlaceholder('Tests')
                    .addOptions(testOptions)
                    .setMaxValues(14)
            )
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId(`notification_settings!${ita.customId.split('!')[1]}`)
                    .setLabel('❮')
                    .setStyle('DANGER')
            )

        await ita.update({ embeds: [embed], ephemeral: true, components: [hwMenu, testMenu, buttons] })

        const collector = ita.message.createMessageComponentCollector({time: 900000})
        collector.on('collect', async (interaction) => {
            if(!interaction.customId.startsWith('notification_types')) return collector.stop()
            if(interaction.customId === 'notification_types_hw') {
                user.data.notifications.types.hw = interaction.values.map(v => parseInt(v))
                const userdata = require('../../../data/userdata.json')
                userdata[user.id] = user.data
                await fs.writeFile('data/userdata.json', JSON.stringify(userdata))
            } else if(interaction.customId === 'notification_types_test') {
                user.data.notifications.types.test = interaction.values.map(v => parseInt(v))
                const userdata = require('../../../data/userdata.json')
                userdata[user.id] = user.data
                await fs.writeFile('data/userdata.json', JSON.stringify(userdata))

            }
        })
    }
}
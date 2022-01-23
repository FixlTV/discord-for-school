const discord = require('discord.js')
const fs = require('fs/promises')

module.exports = {
    id: 'ignored_subjects',
    execute: async (ita, client) => {
        let { user } = ita
        user.data = require(process.cwd() + '/data/userdata.json')[user.id] || {ignoredSubjects: []}
        let subjects = require(process.cwd() + '/data/subjects.json')
        subjects = subjects.map(subject => subject.name)
        subjects.sort()

        let selectMenu = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .addOptions(subjects.map(subject => { return {
                        label: subject,
                        value: subject,
                        default: false
                    }}))
                    .setMinValues(1)
                    .setPlaceholder('Bitte Fäch(er) auswählen')
                    .setCustomId('ignored_subjects_select')
            )
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('user_settings')
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId('ignore_subjects')
                    .setLabel('Fächer ignorieren')
                    .setStyle('DANGER')
                    .setDisabled(true),
                new discord.MessageButton()
                    .setCustomId('add_subjects')
                    .setLabel('Fächer beachten')
                    .setStyle('SUCCESS')
                    .setDisabled(true)
            )
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Ignorierte Fächer')
            .setDescription('Hier kannst du Fächer auswählen, um sie zu ignorieren.\nIgnorierte Fächer werden nicht in deiner personalisierten Hausaufgaben-/Testliste angezeigt.\nUm Fächer zu ignorieren/wieder zu beachten, wähle die entsprechenden Fächer aus und klicke danach auf die passende Schaltfläche.')
        await ita.update({ embeds: [embed], ephemeral: true, components: [selectMenu, buttons] })

        //Daten abwarten
        const filter = i => i.customId == 'ignored_subjects_select'
        const collector = ita.message.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 300000, dispose: true })

        collector.on('collect', async (selectmenu) => {
            buttons.components[1].setDisabled(false)
            buttons.components[2].setDisabled(false)
            selectMenu.components[0].setDisabled(true)
            embed.setDescription('Deine Auswahl wurde übernommen.\nBitte drücke einen der beiden Knöpfe, um die Fächer zu ignorieren/beachten.')
            await selectmenu.update({ embeds: [embed], ephemeral: true, components: [ selectMenu, buttons ]})

            const buttonCollector = ita.message.createMessageComponentCollector({ componentType: 'BUTTON', max: 1 })

            buttonCollector.on('collect', async (button) => {
                if(button.customId == 'user_settings') return collector.stop()
                if(button.customId == 'ignore_subjects') {
                    if(!user.data.ignoredSubjects) user.data.ignoredSubjects = []
                    let ids = selectmenu.values
                    ids.forEach(id => { user.data.ignoredSubjects.push(id) })
                    let userdata = require(process.cwd() + '/data/userdata.json')
                    userdata[user.id] = user.data
                    await fs.writeFile('data/userdata.json', JSON.stringify(userdata))

                    buttons.components[1].setDisabled(true)
                    buttons.components[2].setDisabled(true)
                    selectMenu.components[0].setDisabled(false)

                    let embed = new discord.MessageEmbed()
                        .setColor(client.color.lightblue)
                        .setTitle('Ignorierte Fächer')
                        .setDescription('Hier kannst du Fächer auswählen, um sie zu ignorieren.\nIgnorierte Fächer werden nicht in deiner personalisierten Hausaufgaben-/Testliste angezeigt.\nUm Fächer zu ignorieren/wieder zu beachten, wähle die entsprechenden Fächer aus und klicke danach auf die passende Schaltfläche.')
                        .setFooter('Deine Auswahl wird nun ignoriert.')
                    await button.update({ embeds: [embed], ephemeral: true, components: [selectMenu, buttons] })
                } else {
                    if(!user.data.ignoredSubjects) user.data.ignoredSubjects = []
                    let ids = selectmenu.values
                    ids.forEach(id => { if(user.data.ignoredSubjects.includes(id)) user.data.ignoredSubjects.splice(user.data.ignoredSubjects.indexOf(id), 1) })
                    let userdata = require(process.cwd() + '/data/userdata.json')
                    userdata[user.id] = user.data
                    await fs.writeFile('data/userdata.json', JSON.stringify(userdata))

                    buttons.components[1].setDisabled(true)
                    buttons.components[2].setDisabled(true)
                    selectMenu.components[0].setDisabled(false)

                    let embed = new discord.MessageEmbed()
                        .setColor(client.color.lightblue)
                        .setTitle('Ignorierte Fächer')
                        .setDescription('Hier kannst du Fächer auswählen, um sie zu ignorieren.\nIgnorierte Fächer werden nicht in deiner personalisierten Hausaufgaben-/Testliste angezeigt.\nUm Fächer zu ignorieren/wieder zu beachten, wähle die entsprechenden Fächer aus und klicke danach auf die passende Schaltfläche.')        
                        .setFooter('Die ausgewählten Fächer werden nun angezeigt.')
                    await button.update({ embeds: [embed], ephemeral: true, components: [selectMenu, buttons] })
                }
            })
        })
    }
}
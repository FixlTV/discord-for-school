const discord = require('discord.js')
const fs = require('fs/promises')

module.exports = {
    id: 'edit_homework',
    execute: async (ita, client) => {
        let user = ita.user
        let homework = require(process.cwd() + '/data/ha.json')
        user.data = require(process.cwd() + '/data/userdata.json')[user.id]

        //Hausaufgaben sortieren
        var haarray = []
        for(let month in homework) {
            let dates = homework[month]
            for(let date in dates) {
                let subjects = dates[date]
                for(let subject in subjects) {
                    let ha = subjects[subject]
                    let datex = new Date()
                    datex.setMonth(month, date)
                    datex.setHours(23, 59, 59, 999)
                    if(Date.now() > datex.getTime()) datex.setFullYear(datex.getFullYear() + 1)
                    haarray.push({
                        subject,
                        id: ha.id,
                        time: datex.getTime(),
                        todo: ha.todo
                    })
                }
            }
        }
        haarray.sort((a, b) => {
            if(a.subject > b.subject) return 1
            if(a.subject == b.subject) return 0
            if(a.subject < b.subject) return -1
        })

        //Hausaufgaben auf anzuzeigende Fächer reduzieren
        if(user.data.ignoredSubjects) {
            haarray.forEach(ha => {
                if(user.data.ignoredSubjects.includes(ha.subject)) haarray.splice(haarray.indexOf(ha), 1)
            })
        }

        if(!haarray.length) {
            let embed = new discord.MessageEmbed()
                .setColor(client.color.red)
                .setTitle('Keine Hausaufgaben')
                
        }

        //Output
        let selectMenu = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageSelectMenu()
                    .addOptions(
                        haarray.map(ha => {
                            return {
                                label: `[${ha.id}] ${ha.subject}`,
                                value: ha.id.toString(),
                                description: ha.todo,
                                default: false
                            }
                        })
                    )
                    .setPlaceholder('Bitte Hausaufgabe(n) auswählen')
                    .setCustomId('homework_select')
                    .setMinValues(1)
            )
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setLabel('❮')
                    .setCustomId('user_homework')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setLabel('Als erledigt markieren')
                    .setStyle('SUCCESS')
                    .setCustomId('homework_update!done')
                    .setDisabled(true),
                new discord.MessageButton()
                    .setLabel('Markierung aufheben')
                    .setStyle('DANGER')
                    .setCustomId('homework_update!undone')
                    .setDisabled(true),
            )
        let embed = new discord.MessageEmbed()
            .setTitle('Hausaufgaben bearbeiten')
            .setDescription('Hier kannst du deine Hausaufgaben als erledigt markieren.\nSie werden dir dann weiter unten in der Liste angezeigt.\nWähle dazu eine oder mehrere Hausaufgaben aus der Liste aus und drücke einen der beiden Knöpfe, um die Markierung zu erstellen/entfernen.')
            .setColor(client.color.lightblue)
        await ita.update({ embeds: [embed], ephemeral: true, components: [selectMenu, buttons] })

        //Daten abwarten
        const filter = i => i.customId == 'homework_select'
        const collector = ita.message.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 300000, dispose: true })

        collector.on('collect', async (selectmenu) => {
            buttons.components[1].setDisabled(false)
            buttons.components[2].setDisabled(false)
            selectMenu.components[0].setDisabled(true)
            embed.setDescription('Deine Auswahl wurde übernommen.\nBitte drücke einen der beiden Knöpfe, um die Markierung zu erstellen/entfernen.')
            await selectmenu.update({ embeds: [embed], ephemeral: true, components: [ selectMenu, buttons ]})

            const buttonCollector = ita.message.createMessageComponentCollector({ componentType: 'BUTTON', max: 1 })

            buttonCollector.on('collect', async (button) => {
                if(button.customId == 'user_homework') return collector.stop()
                if(button.customId == 'homework_update!done') {
                    if(!user.data.homeworkDone) user.data.homeworkDone = []
                    let ids = selectmenu.values.map(value => {return parseInt(value)})
                    ids.forEach(id => { user.data.homeworkDone.push(id) })
                    let userdata = require(process.cwd() + '/data/userdata.json')
                    userdata[user.id] = user.data
                    await fs.writeFile('data/userdata.json', JSON.stringify(userdata))

                    buttons.components[1].setDisabled(true)
                    buttons.components[2].setDisabled(true)
                    selectMenu.components[0].setDisabled(false)

                    let embed = new discord.MessageEmbed()
                        .setTitle('Hausaufgaben bearbeiten')
                        .setDescription('Hier kannst du deine Hausaufgaben als erledigt markieren.\nSie werden dir dann weiter unten in der Liste angezeigt.\nWähle dazu eine oder mehrere Hausaufgaben aus der Liste aus und drücke einen der beiden Knöpfe, um die Markierung zu erstellen/entfernen.')
                        .setColor(client.color.lightblue)
                        .setFooter('Deine Auswahl wurde als erledigt markiert.')
                    await button.update({ embeds: [embed], ephemeral: true, components: [selectMenu, buttons] })
                } else {
                    console.log('detected undone')
                    if(!user.data.homeworkDone) user.data.homeworkDone = []
                    let ids = selectmenu.values.map(value => {return parseInt(value)})
                    ids.forEach(id => { if(user.data.homeworkDone.includes(parseInt(id))) user.data.homeworkDone.splice(user.data.homeworkDone.indexOf(parseInt(id)), 1) })
                    let userdata = require(process.cwd() + '/data/userdata.json')
                    userdata[user.id] = user.data
                    await fs.writeFile('data/userdata.json', JSON.stringify(userdata))

                    buttons.components[1].setDisabled(true)
                    buttons.components[2].setDisabled(true)
                    selectMenu.components[0].setDisabled(false)

                    let embed = new discord.MessageEmbed()
                        .setTitle('Hausaufgaben bearbeiten')
                        .setDescription('Hier kannst du deine Hausaufgaben als erledigt markieren.\nSie werden dir dann weiter unten in der Liste angezeigt.\nWähle dazu eine oder mehrere Hausaufgaben aus der Liste aus und drücke einen der beiden Knöpfe, um die Markierung zu erstellen/entfernen.')
                        .setColor(client.color.lightblue)
                        .setFooter('Deine Auswahl wurde aktualisiert.')
                    await button.update({ embeds: [embed], ephemeral: true, components: [selectMenu, buttons] })
                }
            })
        })
    }
}
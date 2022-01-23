const discord = require('discord.js')
const fs = require('fs/promises')

module.exports = {
    id: 'user_homework',
    execute: async (ita, client) => {
        const user = ita.user
        const homework = require(process.cwd() + '/data/ha.json')
        user.data = require(process.cwd() + '/data/userdata.json')[user.id]

        //userdata angelegen
        if(!user.data) {
            user.data = {}
            let userdata = require(process.cwd() + '/data/userdata.json')
            userdata[user.id] = user.data
            await fs.writeFile('data/userdata.json', JSON.stringify(userdata))
        }

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
            if(a.time > b.time) return 1
            if(a.time == b.time) return 0
            if(a.time < b.time) return -1
        })

        //Hausaufgaben auf anzuzeigende Fächer reduzieren
        if(user.data.ignoredSubjects) {
            haarray.forEach(ha => {
                if(user.data.ignoredSubjects.includes(ha.subject)) haarray.splice(haarray.indexOf(ha), 1)
            })
        }

        //Hausaufgaben nach Bearbeitungsstatus sortieren
        haarray.forEach(ha => {
            if(user.data.homeworkDone?.includes(ha.id)) haarray[haarray.indexOf(ha)].done = true
            else haarray[haarray.indexOf(ha)].done = false
        })
        haarray.sort((a, b) => {
            if(a.done && !b.done) return 1
            if(!a.done && b.done) return -1
            return 0
        })

        //Hausaufgaben formatieren
        let output = haarray.map(ha => {return `${(() => {if(ha.done) {return 'Erledigt: _'} else return ''})()}**[${ha.id}]** __${ha.subject}__: ${ha.todo}; Fällig am <t:${Math.round(ha.time / 1000)}:d>${(() => {if(ha.done) {return '_'} else return ''})()}`}).join('\n')
        if(output.length == 0) output = 'Keine Hausaufgaben 🥳'

        //Hausaufgaben ausgeben
        let embed = new discord.MessageEmbed()
            .setTitle(`Deine Hausaufgaben`)
            .setDescription(output)
            .setColor(client.color.lightblue)
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('main_menu')
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId('edit_homework')
                    .setLabel('Status bearbeiten')
                    .setStyle('SECONDARY')
            )
        await ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
    }
}
const discord = require('discord.js')
const { error, success } = require('../../../embeds')
const fs = require('fs/promises')

module.exports = {
    name: 'hausaufgaben',
    description: 'Fügt Hausaufgaben hinzu oder löscht sie.',
    options: [
        {
            name: 'add',
            type: 'SUB_COMMAND',
            description: 'Trägt eine Hausaufgabe für ein beliebiges Datum ein.',
            options: [
                {
                    name: 'fach',
                    description: 'Fach, in dem der Test geschrieben wird',
                    type: 'STRING',
                    required: true,
                    choices: require('../../../data/subjects.json')
                },
                {
                    name: 'tag',
                    description: 'Fälligkeitsdatum',
                    type: 'INTEGER',
                    required: true
                },
                {
                    name: 'monat',
                    description: 'Fälligkeitsdatum',
                    type: 'INTEGER',
                    required: true
                },
                {
                    name: 'todo',
                    description: 'Kurze Beschreibung, was zu tun ist.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'notizen',
                    description: 'Platz für zusätzliche Hinweise, Notizen, etc',
                    type: 'STRING',
                    required: false
                }
            ]
        },
        {
            name: 'next',
            type: 'SUB_COMMAND',
            description: 'Trägt eine Hausaufgabe für die nächste Stunde mit dem jeweiligen Fach ein.',
            options: [
                {
                    name: 'fach',
                    description: 'Fach, in dem der Test geschrieben wird',
                    type: 'STRING',
                    required: true,
                    choices: require('../../../data/subjects.json')
                },
                {
                    name: 'todo',
                    description: 'Kurze Beschreibung, was zu tun ist.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'notizen',
                    description: 'Platz für zusätzliche Hinweise, Notizen, etc',
                    type: 'STRING',
                    required: false
                }
            ]
        },
        {
            name: 'remove',
            type: 'SUB_COMMAND',
            description: 'Entfernt eine Hausaufgabe für ein bestimmtes Datum.',
            options: [
                {
                    name: 'id',
                    description: 'ID der Hausaufgabe',
                    type: 'INTEGER',
                    required: true
                }
            ]
        },
        {
            name: 'get',
            type: 'SUB_COMMAND',
            description: 'Zeigt erweiterte Informationen zu einer Hausaufgabe an.',
            options: [
                {
                    name: 'id',
                    description: 'ID der Hausaufgabe',
                    type: 'INTEGER',
                    required: true
                }
            ]
        }
    ],
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {Object} args 
     * @param {discord.Client} client 
     */
    async run(ita, args, client) {
        var data = require('../../../data/data.json')
        await ita.deferReply({ ephemeral: true })
        if(ita.options.getSubcommand() === 'add') {
            var subject = args['fach'].value
            var todo = args['todo'].value
            var extra = args['notizen']?.value
            var day = args['tag'].value
            var month = Number(args['monat'].value) - 1
            var date = new Date()
            if(!(1 <= month <= 12)) return error(ita, 'Syntaxfehler', '`Monat` muss eine Zahl zwischen 1 und 12 sein.')
            date.setMonth(month, day)
            date.setHours(0, 0, 0, 0)
            if(Date.now() >= date.getTime()) date.setFullYear(date.getFullYear() + 1)
            month = date.getMonth()
            day = date.getDate()
            var has = require('../../../data/ha.json')
            if(!has[month]) has[month] = {}
            if(!has[month][day]) has[month][day] = {}
            has[month][day][subject] = {
                todo: todo.replaceAll(',', ',\n').replaceAll(';', ),
                extra: extra?.replaceAll(',', ',\n').replaceAll(';', ',\n'),
                id: data.haid
            }
            await fs.writeFile('data/ha.json', JSON.stringify(has))
            success(ita, 'Hausaufgabe hinzugefügt', `Die ${subject} Hausaufgabe bis zum ${day}.${month + 1}. wurde gespeichert (ID: ${data.haid})`)
            data.haid ++
            await fs.writeFile('data/data.json', JSON.stringify(data))
            global.events.emit('editMessage')
        } else if(ita.options.getSubcommand() === 'next') {
            var tries = 0
            /**
             * 
             * @param {String} subject 
             * @param {Number} date 
             * @returns {Date} 
             */
            let subject = args['fach'].value
            let todo = args['todo'].value
            let extra = args['notizen']?.value

            function getNextDate(subject, date) {
                var weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
                var d = new Date(date)
                d.setDate(d.getDate() + 1)
                sp = client.stundenplan
                while(!sp[weekday[d.getDay()]].includes(subject) && tries < 255) {
                    tries ++
                    d.setDate(d.getDate() + 1)
                }
                var holiday = false
                if(sp[weekday[d.getDay()]].includes(subject)) {
                    for (const holidays of global.holidays) {
                        let start = new Date(holidays.start)
                        start.setHours(0)
                        let end = new Date(holidays.end)
                        end.setHours(0)
                        if(start.getTime() < d.getTime() && d.getTime() < end.getTime()) {
                            holiday = true
                            break
                        }
                    }
                    if(global.feiertage.includes(d.toISOString().slice(0, 10))) { holiday = true; console.log(1) }
                    if(holiday) getNextDate(subject, d.getTime())
                    else return d
                } else if(tries >= 255) {
                    return false
                }
            }

            let date = getNextDate(subject, Date.now())

            let month = date.getMonth()
            let day = date.getDate()
            let has = require('../../../data/ha.json')
            if(!has[month]) has[month] = {}
            if(!has[month][day]) has[month][day] = {}
            has[month][day][subject] = {
                todo: todo.replaceAll(',', ',\n').replaceAll(';', ',\n'),
                extra: extra?.replaceAll(',', ',\n').replaceAll(';', ',\n'),
                id: data.haid
            }
            await fs.writeFile('data/ha.json', JSON.stringify(has))
            success(ita, 'Hausaufgabe hinzugefügt', `Die ${subject} Hausaufgabe bis zum ${day}.${month + 1}. wurde gespeichert (ID: ${data.haid})`)
            data.haid ++
            await fs.writeFile('data/data.json', JSON.stringify(data))
            global.events.emit('editMessage')
        } else if(ita.options.getSubcommand() == 'remove') {
            var ha
            for (const month in require('../../../data/ha.json')) {
                for(const day in require('../../../data/ha.json')[month]) {
                    for(const subject in require('../../../data/ha.json')[month][day]) {
                        if(args.id.value == require('../../../data/ha.json')[month][day][subject].id) {
                            ha = require('../../../data/ha.json')[month][day][subject]
                            ha.month = month
                            ha.day = day
                            ha.subject = subject
                            break
                        }
                    }
                    if(ha) break
                }
                if(ha) break
            }
            if(!ha) return require('../../../embeds').error(ita, 'Hausaufgabe nicht gefunden', 'Die angegebene Hausaufgabe existiert nicht (mehr).')
            let has = require('../../../data/ha.json')
            delete has[ha.month][ha.day][ha.subject]
            await fs.writeFile('data/ha.json', JSON.stringify(has))
            success(ita, 'Hausaufgabe gelöscht', `Die ${ha.subject} Hausaufgabe bis zum ${ha.day}.${ha.month + 1}. wurde gelöscht`)
            global.events.emit('editMessage')
        } else {
            var ha
            for (const month in require('../../../data/ha.json')) {
                for(const day in require('../../../data/ha.json')[month]) {
                    for(const subject in require('../../../data/ha.json')[month][day]) {
                        if(args.id.value == require('../../../data/ha.json')[month][day][subject].id) {
                            ha = require('../../../data/ha.json')[month][day][subject]
                            ha.month = month
                            ha.day = day
                            ha.subject = subject
                            break
                        }
                    }
                    if(ha) break
                }
                if(ha) break
            }
            if(!ha) return require('../../../embeds').error(ita, 'Hausaufgabe nicht gefunden', 'Die angegebene Hausaufgabe existiert nicht (mehr).')
            let embed = new discord.MessageEmbed()
                .setTitle('Hausaufgabe ID: '+ ha.id)
                .setDescription(`Informationen zur ${ha.subject} Hausaufgabe für den ${ha.day}.${ha.month + 1}.`)
                .addField('Aufgabe', ha.todo)
                .setColor(client.color.lightblue)
            if(ha.extra) embed.addField('Zusätzliche Informationen', ha.extra)
            ita.editReply({ embeds: [embed], ephemeral: true })
        }
    }
}
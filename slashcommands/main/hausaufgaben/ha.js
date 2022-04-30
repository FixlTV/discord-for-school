const discord = require('discord.js')
const { error, success } = require('../../../embeds')
const fs = require('fs/promises')
const getCalendarWeek = require('../../../getCalendarWeek')
const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']


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
            name: 'edit',
            type: 'SUB_COMMAND',
            description: 'Bearbeitet Informationen zu einer Hausaufgabe.',
            options: [
                {
                    name: 'id',
                    description: 'ID der Hausaufgabe',
                    type: 'INTEGER',
                    required: true
                },
                {
                    name: 'tag',
                    description: 'Fälligkeitsdatum',
                    type: 'INTEGER',
                    required: false
                },
                {
                    name: 'monat',
                    description: 'Fälligkeitsdatum',
                    type: 'INTEGER',
                    required: false
                },
                {
                    name: 'todo',
                    description: 'Kurze Beschreibung, was zu tun ist.',
                    type: 'STRING',
                    required: false
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
            tries = 0
            /**
             * 
             * @param {String} subject 
             * @param {Number} date 
             * @returns {Date} 
             */
            let subject = args['fach'].value
            let todo = args['todo'].value
            let extra = args['notizen']?.value
            var date

            var tries

            function getNextDate(subject, inputDate, client) {
                var d = new Date(inputDate)
                d.setHours(0, 0, 0, 0)
                d.setDate(d.getDate() + 1)
                let sp = JSON.parse(JSON.stringify(client.stundenplan))

                //Fächer formatieren
                for (let d in sp) {
                    sp[d].forEach((s) => {
                        if(s.subject) return
                        if(s.includes('$')) {
                            let s1 = s.split('$')[0]
                            sp[d][sp[d].indexOf(s)] = { week: 0, subject: s1 }
                            sp[d].splice(sp[d].indexOf(s1), 0, { week: 1, subject: s.split('$')[1] })
                        } else sp[d][sp[d].indexOf(s)] = { subject: s }
                    })
                }
                
                //Zum nächsten Möglichen Datum skippen
                while(!sp[weekday[d.getDay()]].map(s => s.subject).includes(subject) && tries < 255) {
                    tries ++
                    d.setDate(d.getDate() + 1)
                }

                //Überprüfen, ob die Hausaufgabe hier eingefügt wird
                var skip = false
                if(sp[weekday[d.getDay()]].map(s => s.subject).includes(subject)) {

                    //Ferien/Feiertage
                    for (const holidays of global.holidays) {
                        let start = new Date(holidays.start)
                        start.setHours(0, 0, 0, 0)
                        let end = new Date(holidays.end)
                        end.setHours(0, 0, 0, 0)
                        if(start.getTime() < d.getTime() && d.getTime() < end.getTime()) {
                            skip = true
                            break
                        }
                    }


                    //Wechselndes Fach
                    if(sp[weekday[d.getDay()]].map(s => s.subject).includes(subject) && sp[weekday[d.getDay()]].find(s => s.subject === subject).week) {
                        //Gerade/ungerade Woche herausfinden
                        let subjectWeek = sp[weekday[d.getDay()]].find(s => s.subject === subject).week
                        let dateWeek = 1 - (getCalendarWeek(d) % 2)
                        if(subjectWeek != dateWeek) skip = true
                    }
                    if(global.feiertage.includes(`${d.getFullYear()}-${(() => {if(`${d.getMonth()}`.length == 1) {return '0'} else return ''})() + d.getMonth()}-${(() => {if(`${d.getDate()}`.length == 1) {return '0'} else return ''})() + d.getDate()}`)) { skip = true }
                    if(skip) getNextDate(subject, d.getTime(), client)
                    else {
                        date = new Date(d)
                        return 
                    }
                } else if(tries >= 255) {
                    return false
                }
            }

            getNextDate(subject, Date.now(), client)

            if(!date) throw new Error('could not resolve subject to date')
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
        } else if(ita.options.getSubcommand() == 'edit') {
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
            if(args.monat?.value) ha.month = args.monat.value - 1
            if(args.tag?.value) ha.day = args.tag.value
            if(args.todo?.value) ha.todo = args.todo.value
            if(args.notizen?.value) ha.extra = args.notizen.value
            let has = require('../../../data/ha.json')
            has[ha.month][ha.day][ha.subject] = ha
            await fs.writeFile('data/ha.json', JSON.stringify(has))
            success(ita, 'Hausaufgabe bearbeitet', `Die ${ha.subject} Hausaufgabe bis zum ${ha.day}.${ha.month + 1}. wurde bearbeitet`)
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
                .setDescription(`Informationen zur ${ha.subject} Hausaufgabe für den ${ha.day}.${parseInt(ha.month) + 1}.`)
                .addField('Aufgabe', ha.todo)
                .setColor(client.color.lightblue)
            if(ha.extra) embed.addField('Zusätzliche Informationen', ha.extra)
            ita.editReply({ embeds: [embed], ephemeral: true })
        }
    }
}
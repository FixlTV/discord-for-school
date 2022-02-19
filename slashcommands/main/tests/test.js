const discord = require('discord.js')
const { error, success, warn } = require('../../../embeds')
const fs = require('fs/promises')
const {events: useEvents} = require('../../../config.json')

const options =  [
    {
        type: 'SUB_COMMAND',
        name: 'add',
        description: 'Fügt einen Test hinzu.',
        options: [
            {
                name: 'fach',
                description: 'Fach, in dem der Test geschrieben wird',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'testart',
                description: 'Art des Tests, der geschrieben wird',
                type: 'STRING',
                required: true,
                choices: require("../../../data/testtypes.json")
            },
            {
                name: 'tag',
                description: 'Tag im Monat, an dem der Test geschrieben wird',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'monat',
                description: 'Monat, in dem der Test geschrieben wird.',
                type: 'INTEGER',
                required: true
            }
        ]
    },
    {
        type: 'SUB_COMMAND',
        name: 'remove',
        description: 'Entfernet einen Test.',
        options: [
            {
                name: 'fach',
                description: 'Fach, in dem der Test geschrieben wird',
                type: 'STRING',
                required: true,
                autocomplete: true
            },
            {
                name: 'tag',
                description: 'Tag im Monat, an dem der Test geschrieben wird',
                type: 'INTEGER',
                required: true
            },
            {
                name: 'monat',
                description: 'Monat, in dem der Test geschrieben wird.',
                type: 'INTEGER',
                required: true
            }
        ]
    }
]

if(useEvents) options[0].options.push({
    name: 'uhrzeit',
    description: 'Uhrzeit (in Stunden) des Tests. Benötigt für ein Event. Standardmäßig 8 Uhr.',
    type: 'INTEGER',
    required: false
},
{
    name: 'dauer',
    description: 'Dauer (in Stunden) des Tests. Benötigt für ein Event. Standardmäßig 1 Stunde.',
    type: 'INTEGER',
    required: false
})

module.exports = {
    name: 'test',
    description: 'Trägt Tests ein oder löscht diese.',
    options,
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {Object} args 
     * @param {discord.Client} client 
     */
    async run(ita, args, client) {
        try {await ita.deferReply({ ephemeral: true })} catch {}
        if(ita.options.getSubcommand() === 'add') {
            var subject = args['fach'].value
            var testtype = args['testart'].value
            var day = args['tag'].value
            var month = Number(args['monat'].value) - 1
            var date = new Date()
            if(!(1 <= month <= 12)) return error(ita, 'Syntaxfehler', '`Monat` muss eine Zahl zwischen 1 und 12 sein.')
            date.setMonth(month, day)
            date.setHours(0, 0, 0, 0)
            if(Date.now() >= date.getTime()) date.setFullYear(date.getFullYear() + 1)
            var test = require('../../../data/test.json')
            if(!test[date.getMonth()]) test[date.getMonth()] = {}
            if(!test[date.getMonth()][date.getDate()]) test[date.getMonth()][date.getDate()] = {}
            test[date.getMonth()][date.getDate()][subject] = testtype
            await fs.writeFile('data/test.json', JSON.stringify(test))
            global.events.emit('editMessage')
            if(useEvents) {
                let { guild } = ita

                if(!args.uhrzeit) args.uhrzeit = { value: 8 }
                if(!args.dauer) args.dauer = { value: 1 }
                if(args.uhrzeit.value > 24 || args.uhrzeit.value < 0) return await warn(ita, 'Syntaxfehler', `\`Uhrzeit\` muss eine Zahl zwischen 0 und 24 sein.\nDas Event wird nicht erstellt; der ${subject} Test (${testtype}) am ${day}.${month}. wurde gespeichert.`)
                if(args.dauer.value < 1 || args.dauer.value > 7) return await warn(ita, 'Syntaxfehler', `\`Dauer\` muss eine Zahl zwischen 1 und 7 sein.\nDas Event wird nicht erstellt; der ${subject} Test (${testtype}) am ${day}.${month}. wurde gespeichert.`)
                
                await guild.scheduledEvents.fetch()

                let eventData = {
                    name: `${subject} | ${testtype}`,
                    scheduledStartTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), args.uhrzeit.value, 0, 0, 0),
                    scheduledEndTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), args.uhrzeit.value + args.dauer.value, 0, 0, 0),
                    entityType: 'EXTERNAL',
                    privacyLevel: 'GUILD_ONLY',
                    reason: `Test hinzugefügt von ${ita.user.tag}`,
                    entityMetadata: {location: useEvents}
                }

                if(![...guild.scheduledEvents.cache.values()]
                    .filter(e => e.creatorId === client.user.id)
                    .filter(e => eventData.name === e.name && eventData.scheduledStartTime.getTime() == e.scheduledStartTimestamp)
                    .length
                ) {
                    try { guild.scheduledEvents.create(eventData) } catch {}
                }
            }
            return success(ita, `Test hinzugefügt`, `Ein ${subject} Test (${testtype}) wurde am ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} hinzugefügt.`)
        } else {
            let subject = args.fach.value
            let day = args['tag'].value
            let month = Number(args['monat'].value) - 1
            let date = new Date()
            if(!(1 <= month <= 12)) return error(ita, 'Syntaxfehler', '`Monat` muss eine Zahl zwischen 1 und 12 sein.')
            date.setMonth(month, day)
            date.setHours(0, 0, 0, 0)
            if(Date.now() >= date.getTime()) date.setFullYear(date.getFullYear() + 1)
            let test = require('../../../data/test.json')
            if(!test[date.getMonth()] || !test[date.getMonth()][date.getDate()] || !test[date.getMonth()][date.getDate()][subject]) return error(ita, 'Fehler', `An diesem Tag wird kein ${subject} Test geschrieben.`)
            let testtype = test[date.getMonth()][date.getDate()][subject]
            delete test[date.getMonth()][date.getDate()][subject]
            if(test[date.getMonth()][date.getDate()] == {}) delete test[date.getMonth()][date.getDate()]
            await fs.writeFile('data/test.json', JSON.stringify(test))
            global.events.emit('editMessage')
            if(useEvents) {
                let { guild } = ita
                await guild.scheduledEvents.fetch()
                let name = `${subject} | ${testtype}`
                let events = [...guild.scheduledEvents.cache.values()]            
                    ?.filter(e => e.creatorId === client.user.id)
                    ?.map(e => {
                        let date = new Date(e.scheduledStartTimestamp)
                        date.setHours(0, 0, 0, 0)
                        return {
                            name: e.name,
                            date,
                            id: e.id
                        }
                    })
                    ?.filter(e => e.name == name && e.date.getTime() == date.getTime())
                
                if(events.length) {
                    try { guild.scheduledEvents.delete(events[0].id) } catch {}
                }
            }
            return success(ita, `Test gelöscht`, `Der ${subject} Test (${testtype}) am ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} wurde gelöscht.`)
        }
    }
}
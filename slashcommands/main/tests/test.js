const discord = require('discord.js')
const { error, success } = require('../../../embeds')
const fs = require('fs/promises')

function resolveSubject(int) {
    var subjects = {
        '1': 'Deutsch',
        '2': 'Mathematik',
        '3': 'Englisch',
        '4': 'Physik',
        '5': 'Chemie',
        '6': 'Biologie',
        '7': 'Informatik',
        '8': 'Evangelisch',
        '9': 'Katholisch',
        '10': 'Ethik',
        '11': 'Französisch',
        '12': 'Latein',
        '13': 'Geographie',
        '14': 'Geschichte',
        '15': 'Wirtschaft und Recht',
        '16': 'Sozialkunde',
        '17': 'Musik',
        '18': 'Kunst'
    }
    var subject = subjects[int]
    return subject
}

module.exports = {
    name: 'test',
    description: 'Trägt Tests ein oder löscht diese.',
    options: [
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
                    choices: require('../../../data/subjects.json')
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
                    choices: require('../../../data/subjects.json')
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
    ],
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {Object} args 
     * @param {discord.Client} client 
     */
    async run(ita, args, client) {
        await ita.deferReply({ ephemeral: true })
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
            return success(ita, `Test hinzugefügt`, `Ein ${subject} Test (${testtype}) wurde am ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} hinzugefügt.`)
        } else {
            var subject = args.fach.value
            var day = args['tag'].value
            var month = Number(args['monat'].value) - 1
            var date = new Date()
            if(!(1 <= month <= 12)) return error(ita, 'Syntaxfehler', '`Monat` muss eine Zahl zwischen 1 und 12 sein.')
            date.setMonth(month, day)
            date.setHours(0, 0, 0, 0)
            if(Date.now() >= date.getTime()) date.setFullYear(date.getFullYear() + 1)
            var test = require('../../../data/test.json')
            if(!test[date.getMonth()] || !test[date.getMonth()][date.getDate()] || !test[date.getMonth()][date.getDate()][subject]) return error(ita, 'Fehler', `An diesem Tag wird kein ${subject} Test geschrieben.`)
            let testtype = test[date.getMonth()][date.getDate()][subject]
            delete test[date.getMonth()][date.getDate()][subject]
            if(test[date.getMonth()][date.getDate()] == {}) delete test[date.getMonth()][date.getDate()]
            await fs.writeFile('data/test.json', JSON.stringify(test))
            global.events.emit('editMessage')
            return success(ita, `Test gelöscht`, `Der ${subject} Test (${testtype}) am ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} wurde gelöscht.`)
        }
    }
}
const { error, success } = require('../../embeds')
const { CommandInteraction, Client } = require('discord.js')

module.exports = {
    name: 'geburtstag',
    description: 'Setzt deinen Geburtstag auf ein bestimmtes Datum oder löscht ihn',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'set',
            description: 'Setzt deinen Geburtstag auf ein bestimmtes Datum.',
            options: [
                {
                    name: 'tag',
                    type: 'INTEGER',
                    description: 'Tag im Monat, an dem du Geburtstag hast.',
                    required: true
                },
                {
                    name: 'monat',
                    type: 'INTEGER',
                    description: 'Der Monat, in dem du Geburtstag hast.',
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'delete',
            description: 'Löscht deinen Geburtstag aus dem System.'
        }
    ],
    /**
     * 
     * @param {CommandInteraction} ita 
     * @param {Object} args 
     * @param {Client} client 
     * @returns 
     */
    async run(ita, args, client) {
        var userdata = require('../../userdata.json')
        if(ita.options.getSubcommand() === 'delete') {
            if(!userdata[ita.user.id] || !userdata[ita.user.id].gb) return error(ita, 'Kein Geburtstag', 'Du hast keinen Geburtstag gesetzt. Folglich wurde auch nichts gelöscht.')
            else delete userdata[ita.user.id].gb
            await ita.deferReply({ ephemeral: true })
            await require('fs/promises').writeFile('userdata.json', JSON.stringify(userdata))
            success(ita, 'Geburtstag gelöscht', 'Dein Geburtstag wurde aus dem System gelöscht.')
            global.events.emit('editMessage')
        } else if(ita.options.getSubcommand() === 'set') {
            await ita.deferReply({ ephemeral: true })
            if(!userdata[ita.user.id]) userdata[ita.user.id] = {}
            var d = new Date(2020, args.monat.value - 1, args.tag.value)
            userdata[ita.user.id].gb = {
                day: d.getDate(),
                month: d.getMonth() + 1
            }
            let months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
            await require('fs/promises').writeFile('userdata.json', JSON.stringify(userdata))
            success(ita, 'Geburtstag gespeichert', `Dein Geburtstag wurde am ${d.getDate()}. ${months[d.getMonth()]} gespeichert.`)
            global.events.emit('editMessage')
        }
    }
}
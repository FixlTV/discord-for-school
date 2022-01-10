const discord = require('discord.js')

const weekday = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

module.exports = {
    name: 'info',
    description: 'Zeigt Informationen zu einem beliebigen Tag an',
    options: [
        {
            name: 'tag',
            description: 'Der Tag, der angezeigt werden soll',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'monat',
            description: 'Der Monat, der angezeigt werden soll',
            type: 'INTEGER',
            required: true
        }
    ],
    async run(ita, args, client) {
        await ita.deferReply({ ephemeral: true })
        let day = args['tag'].value
        let month = Number(args['monat'].value) - 1
        let date = new Date(new Date().getFullYear(), month, day, 23, 59, 59, 999)
        while(date.getTime() < Date.now()) date.setFullYear(date.getFullYear() + 1)
        month = date.getMonth()
        day = date.getDate()

        const userdata = require('../../userdata.json')
        const test = require('../../test.json')
        const has = require('../../ha.json')

        var geburtstage = []
        for(var k in userdata) {
            var key = k
            if (userdata[key].gb && userdata[key].gb.day == datum.getDate()) {
                if(userdata[key].gb.month == datum.getMonth() + 1) {
                    geburtstage.push(`<@${key}>`)
                }
            }
        }

        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle(weekday[date.getDay()])
            .setDescription(`Informationen für ${weekday[date.getDay()]}, den ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`)
            .addField('Fächer', client.stundenplan[weekday[date.getDay()]].join('\n'))
        if(geburtstage[0]) embed.addField('Geburtstage', geburtstage.join('\n'))
        if(test[month]?.[day]) {
            var tests = []
            for(let s in test[month][day]) {
                tests.push(`__${s}__: ${test[month][day][s]}`)
            }
            if(tests.length > 0) embed.addField('Tests', tests.join('\n'))
        }
        var haArray = []
        for(let ha in has[month]?.[day]) {
            haArray.push(`**[${has[month][day][ha].id}]** | __${ha}__: ${has[month][day][ha].todo}`)
        }
        if(haArray.length > 0) embed.addField('Hausaufgaben', haArray.join('\n'))
        await ita.editReply({ embeds: [embed] })
    }
}
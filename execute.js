const discord = require('discord.js');
const config = require('./config')
const getCalendarWeek = require('./getCalendarWeek')

var client

module.exports = () => global.events.on('editMessage', async (inputClient) => {
    if(inputClient) client = inputClient
    const test = require('./data/test.json')
    const has = require('./data/ha.json')
    const userdata = require('./data/userdata.json')
    var weekday = new Array(7);
    weekday[0] = "Sonntag";
    weekday[1] = "Montag";
    weekday[2] = "Dienstag";
    weekday[3] = "Mittwoch";
    weekday[4] = "Donnerstag";
    weekday[5] = "Freitag";
    weekday[6] = "Samstag";

    var datum = new Date()
    if(datum.getHours() >= config.sendtime) datum.setDate(datum.getDate() + 1)
    var day = weekday[datum.getDay()]
    var month = datum.getMonth()
    var date = datum.getDate()
    var geburtstage = []
    for(var k in userdata) {
        var key = k
        if (userdata[key].gb && userdata[key].gb.day == datum.getDate()) {
            if(userdata[key].gb.month == datum.getMonth() + 1) {
                geburtstage.push(`<@${key}>`)
            }
        }
    }
    let buttons = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId('main_menu!send')
                .setLabel('Hauptmenü öffnen')
                .setStyle('SECONDARY')
        )

    let subjects = client.stundenplan[day]
    subjects = subjects.map((subject) => {
        if(subject.includes('$')) {
            return subject.split('$')[1 - (getCalendarWeek(datum) % 2)]
        }
        return subject
    })

    var embed = new discord.MessageEmbed()
        .setColor(client.color.lightblue)
        .setDescription(`Informationen für ${day}, den ${datum.getDate()}.${datum.getMonth() + 1}.${datum.getFullYear()}`)
        .setTitle(day)
        .addField('Fächer', subjects.join('\n') || 'Keine')
    if(geburtstage[0]) embed.addField('Geburtstage', geburtstage.join('\n'))
    if(test[month]?.[date]) {
        var tests = []
        for(var s in test[month][date]) {
            var subject = s
            tests.push(`__${subject}__: ${test[month][date][subject]}`)
        }
        if(tests.length > 0) embed.addField('Tests', tests.join('\n'))
    }
    let haArray = []
    for(let ha in has[month]?.[date]) {
        haArray.push(`**[${has[month][date][ha].id}]** | __${ha}__: ${has[month][date][ha].todo.replaceAll('\n', ' ')}`)
    }
    if(haArray.length > 0) embed.addField('Hausaufgaben', haArray.join('\n'))

    if(config.vtp) {
        let vtp = await require('./vertretungsplan')()
        if(vtp && typeof vtp !== 'string') throw new Error(`Fehler beim Laden des Vertretungsplan: Der zurückgegebene Wert ist kein String (${typeof vtp} erhalten).`)
        if(vtp) embed.addField('Vertretungen', vtp)
    }

    if(client.message?.editable) {
        client.message = await client.message.edit({ embeds: [embed], components: [buttons] })
    } else {
        await client.channel.bulkDelete(100).catch(() => {})
        client.message = await client.channel.send({ embeds: [embed], components: [buttons] }).catch(() => {})
    }
})
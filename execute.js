const discord = require('discord.js');

module.exports = global.events.on('editMessage', async (client) => {
    if(client.triggermessage) client.triggermessage = false
    client.channels.fetch(require('./config.json').channel).then(async channel => {
        const test = require('./test.json')
        const userdata = require('./userdata.json')
        var weekday = new Array(7);
        weekday[0] = "Sonntag";
        weekday[1] = "Montag";
        weekday[2] = "Dienstag";
        weekday[3] = "Mittwoch";
        weekday[4] = "Donnerstag";
        weekday[5] = "Freitag";
        weekday[6] = "Samstag";

        var datum = new Date()
        datum.setDate(d.getDate() + 1)
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
        var embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setDescription(`Informationen für ${day}, den ${datum.getDate()}.${datum.getMonth() + 1}.${datum.getFullYear()}`)
            .setTitle(day)
            .addField('Fächer', client.stundenplan[day].join('\n'))
        if(geburtstage[0]) embed.addField('Geburtstage', geburtstage.join('\n'))
        if(test[month]?.[date]) {
            var tests = []
            for(var s in test[month][date]) {
                var subject = s
                tests.push(`__${subject}__: ${test[month][date][subject]}`)
            }
            if(tests.length > 0) embed.addField('Tests', tests.join('\n'))
        }
        await channel.bulkDelete(100).catch(() => {})
        await channel.send({embeds: [embed]}).catch(() => {})
    })
})
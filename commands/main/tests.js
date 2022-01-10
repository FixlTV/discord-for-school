const discord = require('discord.js')

module.exports = {
    commands: ['tests', 'testlist'],
    description: 'Zeigt alle Tests an.',
    type: '',
    callback: async (msg, args, client, stundenplan, gb, hausaufgaben, test, data, userdata, embeds, config, color) => {
        console.log(1)
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle('Tests')
        var tests = []
        for(var month in test) {
            var m = month
            for(var day in m) {
                var d = day
                for(var subject in d) {
                    var s = subject
                    var text = `\`${d}.${m+1}.\` **${s}**: ${test[month]}`
                    tests.push(text)
                }
            }
        }
        if(!tests[0]) {
            tests.push('Es stehen keine Tests an.')
        }
        embed.setDescription(tests.join('\n'))
        msg.delete()
        msg.channel.send({embeds: [embed]})
    }
}
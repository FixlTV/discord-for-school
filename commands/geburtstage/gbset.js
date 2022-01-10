const fs = require('fs')
const discord = require('discord.js')

module.exports = {
    commands: ['gb', 'setgb', 'geburtstage'],
    expectedArgs: '<Tag>.<Monat>.',
    minArgs: 1,
    description: 'Legt deinen Geburtstag fest.',
    type: '',
    callback: (msg, args, client, stundenplan, gb, hausaufgaben, tests, data, userdata, embeds, config, color) => {
        args_ = args[0].split('.')
        arg1 = args_[0]
        arg2 = args_[1]
        if((!isNaN(arg1)) && (!isNaN(arg2))) {
            arg1 = Number(arg1)
            arg2 = Number(arg2)
            if(gb[msg.author.id]) {
                gb[msg.author.id].day = arg1
                gb[msg.author.id].month = arg2
            } else {
                gb[msg.author.id] = {}
                gb[msg.author.id].day = arg1
                gb[msg.author.id].month = arg2
            }
            fs.writeFileSync('./gb.json', JSON.stringify(gb, null, 4))
            msg.delete()
            embeds.success(msg, "Erfolgreich gespeichert!", `Dein Geburtstag wurde als **${arg1}.${arg2}.** gespeichert.`)
            console.log(`${msg.author.username} hat seinen Geburtstag auf ${arg1}.${arg2}. gesetzt.`)
        } else {
            msg.delete()
            embeds.syntaxerror(msg, `${config.prefix}${commands[0]} <Tag>.<Monat>.\``)
        }
    
    }
}
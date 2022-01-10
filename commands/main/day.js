const fs = require('fs')
const discord = require('discord.js')

module.exports = {
    commands: ['day', 'info'],
    description: 'Zeigt Informationen zum angegebenen Tag an. Wenn keiner angegeben ist, wird der aktuelle gezeigt.',
    type: '',
    callback: async (msg, args, client, stundenplan, gb, hausaufgaben, tests, data, userdata, embeds, config, color) => {
        var d = new Date()
        var weekday = new Array(7);
        weekday[0] = "Sonntag";
        weekday[1] = "Montag";
        weekday[2] = "Dienstag";
        weekday[3] = "Mittwoch";
        weekday[4] = "Donnerstag";
        weekday[5] = "Freitag";
        weekday[6] = "Samstag";
        if(args[0]) {var arg1 = args[0].split('.')[0]} else {var arg1}
        var arg2 = msg.content.split('.')[1]
        var arg3 = msg.content.split('.')[2]
        if(!arg3) var arg3
        if (args.join('') !== '') {
            if((!isNaN(arg1)) && (!isNaN(arg2)) && ((!isNaN(arg3)) || (arg3 == ''))) {
                d.setDate(arg1)
                d.setMonth(arg2 - 1)
                if(isNaN(arg3) || arg3.length == 0) {
                    Number(arg2)
                    Number(arg1)
                    const today = new Date()
                    if(arg2 - 1 <= today.getMonth()) {
                        if(arg2 - 1  < today.getMonth()) {
                            d.setFullYear(today.getFullYear() + 1)
                        } else {
                            if(arg1 < today.getDate()) {
                                d.setFullYear(today.getFullYear() + 1)
                            } else {
                                d.setFullYear(today.getFullYear())
                            }
                        }
                    } else {
                        d.setFullYear(today.getFullYear())
                    }
                }
                embeds.dailymsg(msg, weekday, d)
            }       
        } else {
            embeds.dailymsg(msg, weekday, d)
        }
    }
}
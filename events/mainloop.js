const fs = require('fs')
const { Client, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'mainloop',
    event: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    async on(client) {
        var dold = new Date()
        setInterval(async () => {
            const config = require('../config.json')
            const d = new Date()
            let deletedHomework = []
            const userdata = require('../data/userdata.json')

            //Dashboard aktualisieren
            if((d.getHours() == config.sendtime && (d.getMinutes() < dold.getMinutes()))) {
                global.events.emit('editMessage')
            }

            //Notifications senden
            if(d.getHours() != dold.getHours()) {
                let hw = require('../data/ha.json')
                let _hw = {}
                for (x = 1; x <= 14; x++) {
                    let _d = new Date(d)
                    _d.setDate(_d.getDate() + x)
                    _hw[x.toString()] = hw[_d.getMonth()]?.[_d.getDate()] || {}
                }
                let test = require('../data/test.json')
                let _test = {}
                for (x = 1; x <= 14; x++) {
                    let _d = new Date(d)
                    _d.setDate(_d.getDate() + x)
                    _test[x.toString()] = test[_d.getMonth()]?.[_d.getDate()] || {}
                }
                for (let userid in userdata) {
                    let outgoing = ''
                    let data = userdata[userid]
                    if(!data.notifications) continue
                    if(!data.notifications.status & 1) continue
                    if(!data.notifications.time?.includes(d.getHours())) continue
                    let homework
                    let test
                    if(data.notifications.types?.hw?.length) {
                        for (const x in _hw) {
                            let out = ''
                            if(!data.notifications.types?.hw?.includes(parseInt(x))) continue
                            for (const subject in _hw[x]) {
                                if(data.ignoredSubjects?.includes(subject)) continue
                                if (Object.hasOwnProperty.call(_hw[x], subject)) {
                                    const element = _hw[x][subject];
                                    if(data.homeworkDone?.includes(element.id)) continue
                                    if(!out) out += ` __fällig in ${x} Tagen:__\n`.replace('fällig in 1 Tagen', 'morgen fällig').replace('fällig in 2 Tagen', 'übermorgen fällig')
                                    out += `  ${subject}: ${element.todo.replaceAll('\n', '')} (ID: ${element.id})\n`
                                }
                            }
                            if(out) {
                                if(!homework) homework = '**Hausaufgaben**:\n'
                                homework += out
                            }
                        }
                    }
                    if(data.notifications.types?.test?.length) {
                        for (const x in _test) {
                            let out = ''
                            if(!data.notifications.types?.test?.includes(parseInt(x))) continue
                            for (const subject in _test[x]) {
                                if(data.ignoredSubjects?.includes(subject)) continue
                                if (Object.hasOwnProperty.call(_test[x], subject)) {
                                    const type = _test[x][subject];
                                    if(!out) out = `${` __in ${x} Tagen:__`.replace('in 1 Tagen', 'morgen').replace('in 2 Tagen', 'übermorgen')}\n`
                                    out += `  ${subject}: ${type}\n`
                                }
                            }
                            if(out) {
                                if(!test) test = '**Tests**:\n'
                                test += out
                            }
                        }
                    }
                    if(homework || test) {
                        if(test) outgoing += `${test}\n`
                        if(homework) outgoing += `${homework}`
                        try {
                            let channel = await(await client.users.fetch(userid)).createDM()
                            let message = await channel.send(outgoing.replaceAll('**', '').replaceAll('__', ''))
                            let embed = new MessageEmbed()
                                .setColor(client.color.lightblue)
                                .setTitle('Neue Benachrichtigung')
                            if(test) embed.addField('Tests', test.replace('**Tests**:', '').replaceAll(/\n /g, '\n').trim())
                            if(homework) embed.addField('Hausaufgaben', homework.replace('**Hausaufgaben**:', '').replaceAll(/\n /g, '\n').trim())
                            await message.edit({ embeds: [embed], content: null })
                        } catch (e) {}
                    }
                }
            }

            //Alte Daten löschen
            if(dold.getDate() != d.getDate()) {
                let test = require('../data/test.json')
                let ha = require('../data/ha.json')
                if(test[dold.getMonth()]?.[dold.getDate()]) {
                    delete test[dold.getMonth()]?.[dold.getDate()]
                }
                if(ha[dold.getMonth()]?.[dold.getDate()]) {
                    for (const subject in ha[dold.getMonth()]?.[dold.getDate()]) {
                        let homework = ha[dold.getMonth()]?.[dold.getDate()][subject]
                        deletedHomework.push(homework.id)
                    }
                    delete ha[dold.getMonth()]?.[dold.getDate()]
                }
                fs.writeFileSync('data/test.json', JSON.stringify(test))
                fs.writeFileSync('data/ha.json', JSON.stringify(ha))

                if(deletedHomework.length > 0) {
                    for (const month in ha) {
                        if(new Date(d.getFullYear(), month, 1).getTime() > Date.now()) break
                        for (const day in ha[month]) {
                            if(new Date(d.getFullYear(), month, day).getTime() > Date.now()) break
                            for (const subject in ha[month][day]) {
                                let data = ha[month][day][subject]
                                deletedHomework.push(data.id)
                            }
                        }
                    }
                    for(let user in userdata) {
                        if(user.homeworkDone) user.homeworkDone = user.homeworkDone.filter(id => !deletedHomework.includes(id))
                    }
                    fs.writeFileSync('data/userdata.json', JSON.stringify(userdata))
                }
            }
            dold = new Date()
        }, 30000, dold)
    }
}
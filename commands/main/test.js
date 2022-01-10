const fs = require('fs')
const discord = require('discord.js')

const validSubjects = [
    'Chemie', 'C', 'Ch',
    'Musik', 'Mu',
    'Englisch', 'E', 'En',
    'Sport', 'Sp', 'S',
    'Geschichte', 'G', 'Ge',
    'Phyisk', 'Ph', 'Phy', 'P',
    'Mathe', 'M', 'Ma', 'Mathematik',
    'Wirtschaft', 'Recht', 'Wur', 'W', 'R', 'Wirtschaftundrecht', 'Wr',
    'Evangelisch', 'Ev', 'Katholisch', 'K', 'Ka', 'Ethik', 'Et',
    'Deutsch', 'De', 'D',
    'Französisch', 'Franz', 'F', 'Fr',
    'Latein', 'L',
    'Biologie', 'Bio', 'B',
    'Informatik', 'Info', 'It', 'I',
    'Kunst', 'Ku', 'Malen'
]
const validTests = [
    'Ex', 'Sa', 'Schulaufgabe', 'Test'
]

module.exports = {
    commands: ['test', 'arbeit', 'sa', 'ex', 'angesagterleistungsnachweis'],
    description: 'Fügt einen Test zum Kalender hinzu oder löscht ihn.',
    type: '',
    callback: async (msg, args, client, stundenplan, gb, hausaufgaben, test, data, userdata, embeds, config, color) => {
        msg.delete()
        var today      = new Date()
        var invoke     = msg.content.split(' ')[0]
        var cmdtype    = args[0]
        var subject    = args[1]
        var testtype   = args[2]
        if(!args[3] && cmdtype !== 'remove') {
            embeds.syntaxerror(msg, '-test <add | remove> <Fach> [Testart (nur bei add; kann sein: Schulaufgabe, Test, Ex)] <Tag>.<Monat>.[Jahr]')
            return
        }
        if(cmdtype !== 'add' && cmdtype !== 'remove') {
            embeds.syntaxerror(msg, '-test <add | remove> <Fach> [Testart (nur bei add; kann sein: Schulaufgabe, Test, Ex)] <Tag>.<Monat>.[Jahr]')
            return
        }
        if(cmdtype === 'add') {        
            var day   = args[3].split('.')[0]
            var month = msg.content.split('.')[1]
            var year  = msg.content.split('.')[2]
        } else {
            delete testtype
            var day   = args[2].split('.')[0]
            var month = msg.content.split('.')[1]
            var year  = msg.content.split('.')[2]
        }
        if((month == undefined) || (isNaN(day)) || isNaN(month) || day == undefined) {
            embeds.syntaxerror(msg, "-test <add | remove> <Fach> [Testart (nur bei add)] <Tag>.<Monat>.[Jahr]-test <add | remove> <Fach> [Testart (nur bei add; kann sein: Schulaufgabe, Test, Ex)] <Tag>.<Monat>.[Jahr]")
            return
        }
        month -= 1
        if(isNaN(year) || year == undefined || year == '') {
            if(month <= today.getMonth()) {
                if(month  < today.getMonth()) {
                    year = today.getFullYear() + 1
                } else {
                    if(day < today.getDate()) {
                        year = today.getFullYear() + 1
                    } else {
                        year = today.getFullYear()
                    }
                }
            } else {
                year = today.getFullYear()
            }
        }
        if(!isNaN(year)) {
            var d = new Date(year, month, day)
            var subjects = subject.toLowerCase().split('')
            subjects[0] = subjects[0].toUpperCase()
            subjects = subjects.join('')
            subject = subjects
            if(!validSubjects.join(' ').toLowerCase().split(' ').includes(subject.toLowerCase())) {
                embeds.error(msg, ':x: Fehler', `**${subject}** ist kein gültiges Fach.`)
                return
            }
            if(subject === 'C' || subject === 'Ch') {
                subject = 'Chemie'
            } else if(subject === 'Mu') {
                subject = 'Musik'
            } else if(subject === 'E' || subject === 'En') {
                subject = 'Englisch'
            } else if(subject === 'Sp' || subject === 'S') {
                subject = 'Sport'
            } else if(subject === 'G' || subject === 'Ge') {
                subject = 'Geschichte'
            } else if(subject === 'P' || subject === 'Ph' || subject === 'Phy') {
                subject = 'Physik'
            } else if(subject === 'M' || subject === 'Mathematik' || subject === 'Ma') {
                subject = 'Mathe'
            } else if(subject === 'Recht' || subject === 'Wur' || subject === 'W' || subject === 'R' || subject === 'Wuirtschaftundrecht' || subject == 'Wr') {
                subject = 'Wirtschaft'
            } else if(subject === 'Ev') {
                subject = 'Evangelisch'
            } else if(subject === 'K' || subject === 'Ka') {
                subject = 'Katholisch'
            } else if(subject === 'Et') {
                subject = 'Ethik'
            } else if(subject === 'D' || subject === 'De') {
                subject = 'Deutsch'
            } else if(subject === 'Franz' || subject == 'F' || subject === 'Fr') {
                subject = 'Französisch'
            } else if(subject === 'L') {
                subject = 'Latein'
            } else if(subject === 'Bio' || subject === 'B') {
                subject = 'Biologie'
            } else if(subject === 'I' || subject === 'Info' || subject === 'It') {
                subject = 'Informatik'
            } else if(subject === 'Ku' || subject === 'Malen') {
                subject = 'Kunst'
            }
            if(userdata[msg.author.id].testban) {
                embeds.error(msg, ":x: Keine Berechtigung!", "Du wurdest von der Nutzung dieser Funktion gebannt.")
                return
            }
            day = d.getDate()
            month = d.getMonth()
            if(cmdtype == 'add') {
                testtype = testtype.toLowerCase().split('')
                testtype[0] = testtype[0].toUpperCase()
                testtype = testtype.join('')
                if(!validTests.includes(testtype)) {
                    embeds.error(msg, ':x: Fehler', `**${testtype}** ist keine gültige Testart.`)
                    return
                }
                if(testtype === 'Sa') {
                    testtype = 'Schulaufgabe'
                }
                if(!test[month][day]) {
                    test[month][day] = {}
                }
                if(test[month][day][subject]) {//HIER GEHT WAS NICHT!
                    embeds.error(msg, ":x: Bereits vorhanden.", `Für das Fach ${subject} ist am ${day}.${month + 1}.${year} bereits ein Test (${testtype}) eingetragen.`)
                    return 
                } else {
                    if(test[month][day]) {
                        test[month][day][subject] = testtype
                    } else {
                        test[month][day] = {}
                        test[month][day][subject] = testtype
                    }
                }
                embeds.success(msg, ':white_check_mark: Test gespeichert', `Der **${subject}** Test (${testtype}) am **${day}.${month + 1}.${d.getFullYear()}** wurde erfolgreich gespeichert.`)
                fs.writeFileSync('test.json', JSON.stringify(test, null, 4))
                var channel = await client.channels.fetch('803293031016955954')
                var embed = new discord.MessageEmbed()
                    .setColor(color.lightblue)
                    .setTitle('Test hinzugefügt')
                    .setDescription(`${msg.author} hat einen **${subject}** Test (${testtype}) am **${day}.${month + 1}.${year}** eigetragen.`)
                channel.send(embed)

            } else if(cmdtype == 'remove') {
                if(!test[month][day]) {
                    embeds.error(msg, ':x: Fehler', 'Für diesen Tag sind keine Tests eingetragen.')
                    return
                }
                if(!test[month][day][subject]) {
                    embeds.error(msg, ':x: Fehler', `Am ${day}.${month + 1}. ist kein ${subject} Test eingetragen.`)
                    return
                } else {
                    var testtype = test[month][day][subject]
                    delete test[month][day][subject]
                    if(test[month][day] == {}) {
                        delete test[month][day]
                    }
                    fs.writeFileSync('test.json', JSON.stringify(test, null, 4))
                    embeds.success(msg, ':white_check_mark: Test gelöscht', `Der **${subject}** Test (${testtype}) am **${day}.${month + 1}.${year}** wurde erfolgreich gelöscht.`)
                    var channel = await client.channels.fetch('803293031016955954')
                    var embed = new discord.MessageEmbed()
                        .setColor(color.lightblue)
                        .setTitle('Test entfernt')
                        .setDescription(`${msg.author} hat den **${subject}** Test (${testtype}) am **${day}.${month + 1}.${year}** gelöscht.`)
                    channel.send(embed)
                }
            } else {
                embeds.syntaxerror(msg, "-test <add | remove> <Fach> [Testart (nur bei add; kann sein: Schulaufgabe, Test, Ex)] <Tag>.<Monat>.[Jahr]")
            }
        } else {
            embeds.syntaxerror(msg, '-test <add | remove> <Fach> [Testart (nur bei add; kann sein: Schulaufgabe, Test, Ex)] <Tag>.<Monat>.[Jahr]')
        }    
    }
}
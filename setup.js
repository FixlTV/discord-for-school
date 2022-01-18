const readline = require('readline');
const fs = require('fs');
const { Client } = require('discord.js');

module.exports = async () => {
    console.log('\x1b[36m%s\x1b[0m', 'Willkommen beim Setup Assistenten!');
    const client = new Client({ intents: ['DIRECT_MESSAGES'] })
    console.log('Alle erforderlichen Daten werden nun angelegt.')

    if(!fs.existsSync('./data')) fs.mkdirSync('./data');

    console.log('\x1b[2m%s\x1b[0m', '[ ]', 'System wird nach alten Dateien durchsucht.')
    if(fs.existsSync('./test.json')) {
        fs.writeFileSync('data/test.json', fs.readFileSync('test.json'))
        fs.unlinkSync('test.json')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'test.json wurde erfolgreich nach data/test.json verschoben.')
    }
    if(fs.existsSync('./ha.json')) {
        fs.writeFileSync('data/ha.json', fs.readFileSync('ha.json'))
        fs.unlinkSync('ha.json')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'ha.json wurde erfolgreich nach data/ha.json verschoben.')
    }
    if(fs.existsSync('./userdata.json')) {
        fs.writeFileSync('data/userdata.json', fs.readFileSync('userdata.json'))
        fs.unlinkSync('userdata.json')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'userdata.json wurde erfolgreich nach data/userdata.json verschoben.')
    }
    if(fs.existsSync('./data.json')) {
        fs.writeFileSync('data/data.json', fs.readFileSync('data.json'))
        fs.unlinkSync('data.json')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'data.json wurde erfolgreich nach data/data.json verschoben.')
    }

    if(!fs.existsSync('./data/test.json')) {
        fs.writeFileSync('./data/test.json', '{}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'test.json wurde angelegt.')
    }
    if(!fs.existsSync('./data/ha.json')) {
        fs.writeFileSync('./data/ha.json', '{}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'ha.json wurde angelegt.')
    }
    if(!fs.existsSync('./data/userdata.json')) {
        fs.writeFileSync('data/userdata.json', '{}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'userdata.json wurde angelegt.')
    }
    if(!fs.existsSync('./data/data.json')) {
        fs.writeFileSync('./data/data.json', '{"haid": 0}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'data.json wurde angelegt.')
    }

    const rl = new readline.createInterface(process.stdin, process.stdout)
    const util = require('util');
    const question = util.promisify(rl.question).bind(rl);

    async function ynQuestion(input) {
        let answer = await question(input + ' \x1b[2m[y/n]\x1b[0m' + '\n >  ')
        if(answer.toLowerCase().startsWith('y')) return true
        else if(answer.toLowerCase().startsWith('n')) return false
        else return await ynQuestion(input)
    }

    if(!fs.existsSync('./config.json')) {
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'config.json wird angelegt.')

        async function getToken() {
            let token = await question('\x1b[93m[!]\x1b[0m Bitte Bot Token eingeben\n >  ')
            try {
                await client.login(token)
                console.log('\x1b[92m%s\x1b[0m', '[✓]', 'Token wurde erfolgreich eingelesen.')
                if(!await ynQuestion('\x1b[93m[!]\x1b[0m Bot Tag: ' + client.user.tag + '?')) return getToken()
            } catch (err) {
                console.error('\x1b[91m%s\x1b[0m', '[X]', 'Token ist ungültig!')
                token = await getToken()
            }
            return token
        }

        let token = await getToken()

        async function getSendTime() {
            let sendTime = await question('\x1b[93m[!]\x1b[0m Bitte Stunde, in der das Dashboard auf den nächsten Tag aktualisiert werden soll, eingeben \x1b[2m[0-23]\x1b[0m\n >  ')
            if(isNaN(sendTime) || Number(sendTime) < 0 || Number(sendTime) > 23) {
                console.error('\x1b[91m%s\x1b[0m', '[X]', 'Ungültige Zeit! Bitte einen Integer zwischen 0 und 23 eingeben.')
                sendTime = await getSendTime()
            }
            return sendTime
        }
        
        let sendTime = await getSendTime()

        async function getChannel() {
            let channel = await question('\x1b[93m[!]\x1b[0m Bitte Channel ID für das Dashboard eingeben\n >  ')
            try {
                await client.channels.fetch(channel)
                console.log('\x1b[92m%s\x1b[0m', '[✓]', 'Channel wurde erfolgreich eingelesen.')
                if(!await ynQuestion('\x1b[93m[!]\x1b[0m Kanalname: ' + client.channels.cache.get(channel).name + '?')) return getChannel()
            } catch (err) {
                console.error('\x1b[91m%s\x1b[0m', '[X]', 'Ungültiger Kanal! Befindet sich der Bot bereits auf dem Server?')
                channel = await getChannel()
            }
            return channel
        }

        let channel = await getChannel()

        var mods = []
        async function getMods() {
            let mod
            if(mods.length) mod = await ynQuestion('\x1b[93m[!]\x1b[0m Weitere Moderatoren hinzufügen?')
            else mod = await ynQuestion('\x1b[93m[!]\x1b[0m Moderatoren hinzufügen?')
            if(mod) {
                mod = await question('\x1b[93m[!]\x1b[0m Bitte User ID des Moderators eingeben\n >  ')
                try {
                    await client.users.fetch(mod)
                    console.log('\x1b[92m%s\x1b[0m', '[✓]', 'Moderator wurde erfolgreich eingelesen.')
                    mods.push(mod)
                } catch {
                    console.error('\x1b[91m%s\x1b[0m', '[X]', 'Ungültiger Nutzer!')
                }
                await getMods()
            }
        }

        await getMods()
        mods = [...new Set(mods)]

        async function getState() {
            let state = await question('\x1b[93m[!]\x1b[0m Bitte Bundesland-Code oder "?" für eine Liste möglicher Antworten eingeben\n >  ')
            if(state == '?') {
                console.log('\x1b[36m[ ]\x1b[0m', 'Bundesland-Codes:')
                console.log('    BW: Baden-Württemberg')
                console.log('    BY: Bayern')
                console.log('    BE: Berlin')
                console.log('    BB: Brandenburg')
                console.log('    HB: Bremen')
                console.log('    HH: Hamburg')
                console.log('    HE: Hessen')
                console.log('    MV: Mecklenburg-Vorpommern')
                console.log('    NI: Niedersachsen')
                console.log('    NW: Nordrhein-Westfalen')
                console.log('    RP: Rheinland-Pfalz')
                console.log('    SL: Saarland')
                console.log('    SN: Sachsen')
                console.log('    ST: Sachsen-Anhalt')
                console.log('    SH: Schleswig-Holstein')
                console.log('    TH: Thüringen')
                state = await getState()
            } else if(['BW', 'BY', 'BE', 'BB', 'HB', 'HH', 'HE', 'NW', 'NI', 'NW', 'RP', 'SL', 'SN', 'ST', 'SH', 'TH'].includes(state.toUpperCase())) return state.toUpperCase()
            else {
                console.log('\x1b[91m%s\x1b[0m', '[X]', 'Ungültiger Bundesland-Code! Verwende ? für eine Liste möglicher Antworten.')
                state = await getState()
            }
            return state
        }

        let state = await getState()

        let config = {
            token,
            color: {
                red: "0xED4245",
                lightblue: "0x3498db",
                lime: "0x57F287",
                yellow: "0xFEE75C"
            },
            mods,
            channel,
            sendtime: sendTime,
            state
        }

        client.destroy()
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'config.json wurde erfolgreich angelegt.')
    }

    if(!fs.existsSync('data/stundenplan.json')) {
        let create = await ynQuestion('\x1b[93m[!]\x1b[0m Stundenplan anlegen?')
        if(create) {
            console.log('\x1b[92m%s\x1b[0m', '[✓]', 'stundenplan.json wird angelegt.')
            fs.writeFileSync('stundenplan.json', '{"Montag": [], "Dienstag": [], "Mittwoch": [], "Donnerstag": [], "Freitag": [], "Samstag": [], "Sonntag": []}')
            console.log('\x1b[93m%s\x1b[0m', '[!]', 'Bitte jedes Fach für jeden Tag \x1b[1meinmal\x1b[0m eingeben. Zum Speichern des Tages "Enter" drücken.\n    Nach dem Speichern eines Tages kann er nicht weiter bearbeitet werden.')
    
            const weekday = [ 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag' ]

            for (const day of weekday) {
                console.log('\x1b[93m[!]\x1b[0m', 'Bitte Fächer für', day, 'eingeben')

                async function newSubject() {
                    let fach = await question('\x1b[93m[!]\x1b[0m Bitte Fach eingeben\n >  ')
                    if(fach && fach.trim().match(/[\w -]+/g)) {
                        let stundenplan = require('./stundenplan.json')
                        if(!stundenplan[day]) stundenplan[day] = []
                        stundenplan[day].push(fach.trim())
                        stundenplan[day] = [...new Set(stundenplan[day])]
                        fs.writeFileSync('./stundenplan.json', JSON.stringify(stundenplan, null, 4))
                        await newSubject()
                    } else if(fach?.trim()) {
                        console.log('\x1b[91m%s\x1b[0m', '[X]', 'Bitte gib ein Fach an (Nur Buchstaben, Zahlen, Unter-/Bindestriche und Leerzeichen)')
                        await newSubject()
                    } else {
                        return
                    }
                }

                await newSubject()
                if(!require('./data/stundenplan.json')[day]) {
                    let stundenplan = require('./data/stundenplan.json')
                    stundenplan[day] = []
                    fs.writeFileSync('data/stundenplan.json', JSON.stringify(stundenplan, null, 4))
                }
            }

            console.log('\x1b[92m%s\x1b[0m', '[✓]', 'Stundenplan gespeichert')
        }
    }

    if(!fs.existsSync('./data/subjects.json')) {
        console.log('\x1b[2m%s\x1b[0m', '[ ]', 'Fächer werden extrahiert')

        var subjects = []
        for (const day in require('./data/stundenplan.json')) {
            require('./data/stundenplan.json')[day].forEach(subject => {
                subjects.push(subject)
            })
        }
        subjects = [...new Set(subjects)]
        subjects = subjects.map(subject => { return { name: subject, value: subject }})
        fs.writeFileSync('data/subjects.json', JSON.stringify(subjects))

        if(subjects.length > 25) {
            console.log('\x1b[91m%s\x1b[0m', '[X]', 'Es wurden mehr als 25 unterschiedliche Fächerbezeichnungen gefunden.')
            console.log('    Bitte beachte, das Discord Choices maximal 25 Optionen unterstützen kann.')
            console.log('    Die Einrichtung wird unterbrochen und der Stundenplan deaktiviert.')
            fs.writeFileSync('data/stundenplan.save.json', fs.writeFileSync('data/stundenplan.json'))
            fs.unlinkSync('data/stundenplan.json')
            fs.unlinkSync('data/subjects.json')
            process.exit(-1)
        }

        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'subjects.json wurde angelegt.')
    }

    rl.close()

    console.log('\x1b[92m%s\x1b[0m', '[✓]', 'Einrichtung abgeschlossen!')
    console.log('\x1b[2m%s\x1b[0m', '----------------------------------------------------------------')
}
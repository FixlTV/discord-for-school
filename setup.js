const readline = require('readline');
const fs = require('fs');
const { Client } = require('discord.js');

module.exports = async () => {
    console.log('\x1b[36m%s\x1b[0m', 'Willkommen beim Setup Assistenten!');
    const client = new Client({ intents: ['DIRECT_MESSAGES'] })
    console.log('Alle erforderlichen Daten werden nun angelegt.')
    if(!fs.existsSync('./test.json')) {
        fs.writeFileSync('./test.json', '{}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'test.json wurde angelegt.')
    }
    if(!fs.existsSync('./ha.json')) {
        fs.writeFileSync('./ha.json', '{}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'ha.json wurde angelegt.')
    }
    if(!fs.existsSync('./userdata.json')) {
        fs.writeFileSync('./userdata.json', '{}')
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'userdata.json wurde angelegt.')
    }
    if(!fs.existsSync('./data.json')) {
        fs.writeFileSync('./data.json', '{"haid": 0}')
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
        console.log('\x1b[93m%s\x1b[0m', '[!]', 'Eingreifen erforderlich!')

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
            sendtime: sendTime
        }

        client.destroy()
        fs.writeFileSync('./config.json', JSON.stringify(config, null, 4))
        console.log('\x1b[92m%s\x1b[0m', '[✓]', 'config.json wurde erfolgreich angelegt.')
    }

    if(!fs.existsSync('./stundenplan.json')) fs.writeFileSync('./stundenplan.json', '{"Montag": [], "Dienstag": [], "Mittwoch": [], "Donnerstag": [], "Freitag": []}')

    rl.close()

    console.log('\x1b[92m%s\x1b[0m', '[✓]', 'Einrichtung abgeschlossen!')
    console.log('\x1b[93m%s\x1b[0m', '[!]', 'Bitte Fächer in Commands und stundenplan.json eintragen (Funktion wird in Zukunft zum Setup Assistenten hinzugefügt)')
    console.log('\x1b[2m%s\x1b[0m', '----------------------------------------------------------------')
}
const discord = require('discord.js');
const client  = new discord.Client({ intents: ['GUILDS', 'GUILD_EMOJIS_AND_STICKERS', 'DIRECT_MESSAGES'] })
const fs = require('fs');

(async () => {
    if(!fs.existsSync('data/test.json') || !fs.existsSync('data/ha.json') || !fs.existsSync('data/userdata.json') || !fs.existsSync('data/data.json') || !fs.existsSync('./config.json') || !fs.existsSync('data/stundenplan.json') || !fs.existsSync('data/subjects.json') || !fs.existsSync('data/testtypes.json')) await require('./setup.js')()
    if((require('./config.template.json').length != Object.keys(require('./config.json')).length) || (require('./config.json').vtp & !fs.existsSync('vertretungsplan.js'))) await require('./setup.js')()
    const config  = require('./config.json')
    const { default: axios } = require('axios')
    const Emitter = require('events').EventEmitter

    client.on('ready', async () => {

        //fetch holiday information
        global.holidays = []
        global.feiertage = []
        let d = new Date()
        axios.get('https://feiertage-api.de/api/?jahr=' + d.getFullYear() + '&nur_land=' + config.state).then(async data => {
            data = data.data
            for (const day in data) {
                global.feiertage.push(data[day].datum)
            }
        })
        axios.get('https://feiertage-api.de/api/?jahr=' + (d.getFullYear() + 1) + '&nur_land=' + config.state).then(async data => {
            data = data.data
            for (const day in data) {
                global.feiertage.push(data[day].datum)
            }
        })
        let holidays = await (await axios.get('https://ferien-api.de/api/v1/holidays/' + config.state + '/' + d.getUTCFullYear())).data
        holidays.forEach(h => global.holidays.push(h))
        holidays = await (await axios.get('https://ferien-api.de/api/v1/holidays/' + config.state + '/' + (d.getUTCFullYear() + 1))).data
        holidays.forEach(h => global.holidays.push(h))

        //add useless properties to the client
        client.color = config.color
        client.stundenplan = require('./data/stundenplan.json')
        client.slashCommands = new discord.Collection()

        //fetch the daily logging channel
        client.channel = await client.channels.fetch(config.channel)
        await client.channel.messages.fetch()
        client.message = null
        if(client.channel.lastMessage?.editable) client.message = client.channel.lastMessage

        //do more useless stuff
        client.setMaxListeners(0)
        global.events = new Emitter()

        require('./execute')()
        global.events.emit('editMessage', client)
        await require('./slashhandler')(client)
        await require('./buttonhandler')(client)
        await require('./eventhandler')(client)
        client.user.setStatus('online')
    })

    client.login(config.token)
})()
const discord = require('discord.js');
const client  = new discord.Client({ intents: 1 << 14 })
const fs = require('fs');

(async () => {
    if(!fs.existsSync('./test.json') || !fs.existsSync('./ha.json') || !fs.existsSync('./userdata.json') || !fs.existsSync('./data.json') || !fs.existsSync('./config.json') || !fs.existsSync('./stundenplan.json')) await require('./setup.js')()
    const config  = require('./config.json')
    const eventhandler = require('./eventhandler')
    const slashhandler = require('./slashhandler')
    const { default: axios } = require('axios')
    const Emitter = require('events').EventEmitter

    client.on('ready', async () => {

        //fetch holiday information
        global.holidays = []
        global.feiertage = []
        let d = new Date()
        axios.get('https://feiertage-api.de/api/?jahr=' + d.getFullYear() + '&nur_land=BY').then(async data => {
            data = data.data
            for (const day in data) {
                if(day !== "Augsburger Friedensfest") global.feiertage.push(data[day].datum)
            }
        })
        axios.get('https://feiertage-api.de/api/?jahr=' + (d.getFullYear() + 1) + '&nur_land=BY').then(async data => {
            data = data.data
            for (const day in data) {
                if(day !== "Augsburger Friedensfest") global.feiertage.push(data[day].datum)
            }
        })
        let holidays = await (await axios.get('https://ferien-api.de/api/v1/holidays/BY/' + d.getUTCFullYear())).data
        holidays.forEach(h => global.holidays.push(h))
        holidays = await (await axios.get('https://ferien-api.de/api/v1/holidays/BY/' + (d.getUTCFullYear() + 1))).data
        holidays.forEach(h => global.holidays.push(h))

        //add useless properties to the client
        client.color = config.color
        client.stundenplan = require('./stundenplan.json')
        client.slashCommands = new discord.Collection()

        //fetch the daily logging channel
        client.channel = await client.channels.fetch(config.channel)
        await client.channel.messages.fetch()

        //do more useless stuff
        client.setMaxListeners(0)
        global.events = new Emitter()

        require('./execute')()
        global.events.emit('editMessage', client)
        await require('./commandhandler')(client)
        await slashhandler(client)
        await eventhandler(client)
        client.user.setStatus('online')
    })

    client.login(config.token)
})()
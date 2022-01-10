const discord   = require('discord.js')

module.exports = {
    name: 'Infonachricht',
    event: 'ready',
    once: true,
    async on(client) {
        let tempdate = new Date()
        var dold = new Date(tempdate.setMinutes(59))
        setInterval(async () => {
            const config = require('../config.json')
            const d = new Date()
            if((d.getHours() == config.sendtime && (d.getMinutes() < dold.getMinutes()))) {
                global.events.emit('editMessage')
            }
            dold = new Date()
        }, 30000, dold)
    }
}
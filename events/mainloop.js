const fs = require('fs')

module.exports = {
    name: 'mainloop',
    event: 'ready',
    once: true,
    async on(client) {
        var dold = new Date()
        setInterval(async () => {
            const config = require('../config.json')
            const d = new Date()
            if((d.getHours() == config.sendtime && (d.getMinutes() < dold.getMinutes()))) {
                global.events.emit('editMessage')
            }
            if(dold.getDate() != d.getDate()) {
                let test = require('../data/test.json')
                let ha = require('../data/ha.json')
                if(test[dold.getMonth()]?.[dold.getDate()]) delete test[dold.getMonth()]?.[dold.getDate()]
                if(ha[dold.getMonth()]?.[dold.getDate()]) delete ha[dold.getMonth()]?.[dold.getDate()]
                fs.writeFileSync('data/test.json', JSON.stringify(test))
                fs.writeFileSync('data/ha.json', JSON.stringify(ha))
            }
            dold = new Date()
        }, 30000, dold)
    }
}
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
            let deletedHomework = []
            if((d.getHours() == config.sendtime && (d.getMinutes() < dold.getMinutes()))) {
                global.events.emit('editMessage')
            }
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
                    let userdata = require('../data/userdata.json')
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
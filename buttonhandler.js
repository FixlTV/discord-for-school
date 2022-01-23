const fs = require('fs')
const path = require('path')

module.exports = async (client) => {
    var buttons = []
    const readButtons = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readButtons(path.join(dir, file))
            } else {
                if(file.endsWith('.js') && !file.startsWith('subfile')) {
                    var button = require(path.join(__dirname, dir, file))
                    button.path = path.join(__dirname, dir, file)
                    if(button.execute && button.id) {
                        console.log(`[${client.user.username}]: Button ${button.id} wird geladen...`)
                    }
                    if(button.execute) buttons.push(button)
                }
            }
        }
    }
    console.log(`[${client.user.username}]: ButtonInteractions werden geladen...`)
    readButtons('buttons')
    console.log(`[${client.user.username}]: ButtonInteractions geladen.`)

    client.on('interactionCreate', async function(ita) {
        if(!ita.isButton()) return
        const button = buttons.find(b => b.id === ita.customId.replaceAll(/!.+/g, ''))
        if(!button) return
        button.execute(ita, client)
    })
}
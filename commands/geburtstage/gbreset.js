const fs = require('fs')
const discord = require('discord.js')

module.exports = {
    commands: ['gbreset'],
    description: 'Löscht deinen Geburtstag.',
    type: '',
    callback: (msg, args, client, stundenplan, gb, hausaufgaben, tests, data, userdata, embeds, config, color) => {
        delete gb[msg.author.id]
        fs.writeFileSync('./gb.json', JSON.stringify(gb, null, 4))
        msg.delete()
        embeds.success(msg, ":wastebasket: Daten gelöscht!", "Dein Geburtstag wurde erfolgreich aus dem System gelöscht.")
    }
}
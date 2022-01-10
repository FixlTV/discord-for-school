const discord = require('discord.js')
const color = require('./config.json').color

module.exports = {
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {String} permission
     * @returns {discord.CommandInteraction}
     */
    async needperms(ita, permission) {
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(':x: Zugriff verweigert!')
            .setDescription(`Um diesen Befehl auszuführen, benötigst du \`\`${permission}\`\`.`)
        if(ita.replied || ita.deferred) await ita.editReply({ embeds: [embed] }).catch()
        else await ita.reply({ embeds: [embed], ephemeral: true })
        return Promise.resolve(ita)
    },
    dailymsg(msg, weekday, d) {
        const sp = require('./stundenplan.json')
        const gb = require('./gb.json')
        const test = require('./test.json')
        var message
        const day = weekday[d.getDay()]
        const date = d.getDate()
        const month = d.getMonth() + 1
        const year = d.getFullYear()
        const data = sp[day]
        var embed = new discord.MessageEmbed()
            .setColor(color.lightblue)
            .setTitle(day)
            .setDescription(`Informationen zu **${day}**, den **${date}.${month}.${year}**`)
            .addField('Fächer:', data)
        var geburtstage = []
        for (var k in gb) {
            var key = k
            if(gb[key].day == date) {
                if(gb[key].month == month) {
                    geburtstage.push(`<@${key}>`)
                }
            }
        }
        if(geburtstage.join('') == '') {
        } else {
            embed.addField('Geburtstage', geburtstage)
        }
        if(test[month - 1][date]) {
            var tests = []
            var temp = 0
            for (var s in test[month - 1][date]) {
                var subject = s
                tests.push(`**${subject}**: ${test[month - 1][date][subject]}`)
                temp = 1
            }
            if(temp == 1) {
                embed.addField('Tests', tests)
                embed.setColor(color.red)
            }
        }
        msg.delete()
        msg.channel.send(embed).then((msg) => {
            message = msg
        })

        return Promise.resolve(message)
    },
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {String} title 
     * @param {String} text 
     * @returns {discord.CommandInteraction}
     */
    async error(ita, title, text) {
        var embed = new discord.MessageEmbed()
            .setTitle(':x: ' + title)
            .setColor(color.red)
            .setDescription(text)
        if(ita.replied || ita.deferred) await ita.editReply({ embeds: [embed] }).catch()
        else await ita.reply({ embeds: [embed], ephemeral: true })
        return Promise.resolve(ita)
    },
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {String} title 
     * @param {String} text 
     * @returns {discord.CommandInteraction}
     */
    async success(ita, title, text) {
        var embed = new discord.MessageEmbed()
            .setTitle('✅ ' + title)
            .setColor(color.lime)
            .setDescription(text)
        if(ita.replied || ita.deferred) await ita.editReply({ embeds: [embed] }).catch()
        else await ita.reply({ embeds: [embed], ephemeral: true }).catch()
        return Promise.resolve(ita)
    },
    /**
     * 
     * @param {discord.CommandInteraction} ita
     * @param {String} syntax
     * @returns {discord.CommandInteraction}
     */
    async syntaxerror(ita, syntax) {
        var embed = new discord.MessageEmbed()
            .setColor(color.red)
            .setTitle(':x: Syntaxfehler')
            .setDescription(`Unbekannte Syntax. Bitte verwende:\n\`${syntax}\``)
        if(ita.replied || ita.deferred) await ita.editReply({ embeds: [embed] }).catch()
        else await ita.reply({ embeds: [embed], ephemeral: true })
        return Promise.resolve(ita)
    }
}

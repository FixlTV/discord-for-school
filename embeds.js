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
    },
    async warn(ita, title, text) {
        let embed = new discord.MessageEmbed()
            .setTitle('⚠️ ' + title)
            .setColor(color.yellow)
            .setDescription(text)
        if(ita.replied || ita.deferred) await ita.editReply({ embeds: [embed] }).catch()
        else await ita.reply({ embeds: [embed], ephemeral: true }).catch()
        return Promise.resolve(ita)
    }
}

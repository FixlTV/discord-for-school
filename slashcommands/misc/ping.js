const discord = require('discord.js')

module.exports = {
    name: 'ping',
    description: 'Zeigt die Latenz vom Bot an.',
    async run(ita, args, client) {
        var embed = new discord.MessageEmbed()
            .setColor(client.color.yellow)
            .setTitle('Pinging...')
            .setDescription('Dies kann einige Zeit dauern.')
        await ita.reply({ embeds: [embed], ephemeral: true })
        let ping = client.ws.ping
        embed
            .setColor(client.color.lime)
            .setTitle('🏓 Pong!')
            .setDescription(`Aktuelle Latenz: ${ping} ms`)
        await ita.editReply({ embeds: [embed] })
        return ita
    }
}
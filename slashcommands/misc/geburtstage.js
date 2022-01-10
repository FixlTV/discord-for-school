const discord = require('discord.js')

module.exports = {
    name: 'geburtstage',
    description: 'Listet alle Geburtstage auf.',
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {Object} args 
     * @param {discord.Client} client 
     */
    async run(ita, args, client) {
        console.log(ita.user)
        await ita.deferReply({ ephemeral: true })
        const userdata = require('../../userdata.json')
        var gbs = {}
        for (var key in userdata) {
            data = userdata[key]
            if(data.gb) {
                if(!gbs[data.gb.month]) gbs[data.gb.month] = []
                if(ita.guild.members.cache.get(key)) gbs[data.gb.month].push({ name: ita.guild.members.cache.get(key).displayName, date: data.gb.day })
            }
        }
        for(let i = 1; i <= 12; i++) {
            if(gbs[i]) {
                gbs[i].sort((a, b) => {
                    if(a.date > b.date) return 1
                    if(a.date == b.date) return 0
                    if(a.date < b.date) return -1
                })
            }
        }
        let output = []
        for(let i = 1; i <= 12; i++) {
            if(gbs[i]) {
                if(i == 1) output.push('-- Januar --');else if(i==2)output.push('-- Februar --');else if(i==3)output.push('-- März --');else if(i==4)output.push('-- April --');else if(i==5)output.push('-- Mai --');else if(i==6)output.push('-- Juni --');else if(i==7)output.push('-- Juli --');else if(i==8)output.push('-- August --');else if(i==9)output.push('-- September --');else if(i==10)output.push('-- Oktober --');else if(i==11)output.push('-- November --');else output.push('-- Dezember --')
                gbs[i].forEach(gb => {
                    let month = new String(i)
                    let date = new String(gb.date)
                    let name = gb.name
                    while(name.length < 32) {name += ' '}
                    while(month.length < 2) {month = '0' + month}
                    while(date.length < 2) {date = '0' + date}
                    output.push(`${name} | ${date}.${month}.`)
                })
            }
        }
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Geburtstage')
            .setDescription(`Hier ist eine Liste aller eingetragenen Geburtstage:\n\`\`\`${output.join('\n')}\`\`\``)
        await ita.editReply({embeds: [embed]})
    }
}
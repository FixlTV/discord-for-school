const discord = require('discord.js')

module.exports = {
    name: 'hausaufgaben-liste',
    description: 'Zeigt alle Hausaufgaben an.',
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {Object} args 
     * @param {discord.Client} client 
     */
    async run(ita, args, client) {
        await ita.deferReply({ ephemeral: true })
        const has = require('../../../ha.json')
        var haarray = []
        for(var month in has) {
            var dates = has[month]
            for(var date in dates) {
                var subjects = dates[date]
                for(var subject in subjects) {
                    var ha = subjects[subject]
                    let datex = new Date()
                    datex.setMonth(month, date)
                    datex.setHours(0, 0, 0, 0)
                    if(Date.now() > datex.getTime()) datex.setFullYear(datex.getFullYear() + 1)
                    haarray.push({
                        subject,
                        id: ha.id,
                        time: datex.getTime()
                    })
                }
            }
        }
        haarray.sort((a, b) => {
            if(a.time > b.time) return 1
            if(a.time == b.time) return 0
            if(a.time < b.time) return -1
        })
        var maxSubjectLength = 0
        haarray.forEach((ha) => {
            let date = new Date()
            date.setTime(ha.time)
            ha.date = date.getDate()
            ha.month = date.getMonth() + 1
            ha.year = date.getFullYear()
            if(ha.subject.length > maxSubjectLength) maxSubjectLength = ha.subject.length
        })
        var text = []
        haarray.forEach(ha => {
            var subject = ha.subject
            var id = ha.id
            var date = String(ha.date)
            var month = String(ha.month)
            while (subject.length < maxSubjectLength) subject += ' '
            while (id.length < 4) id = ` ${id}`
            if (date.length < 2) date = `0${date}`
            if (month.length < 2) month = `0${month}`
            if(!text.includes(`${ha.year}`)) text.push(`${ha.year}`)
            text.push(` ${subject} | ${date}.${month}. | ${id}`)
        })
        if(text.length == 0) text.push('Es gibt aktuell keine Hausaufgaben :D')
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Hausaufgaben')
            .setDescription(`\`\`\`\n${text.join('\n')}\`\`\``)
        await ita.editReply({embeds: [embed]})
    }
}
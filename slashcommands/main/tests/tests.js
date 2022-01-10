const discord = require('discord.js')

module.exports = {
    name: 'tests',
    description: 'Zeigt alle Tests an.',
    /**
     * 
     * @param {discord.CommandInteraction} ita 
     * @param {Object} args 
     * @param {discord.Client} client 
     */
    async run(ita, args, client) {
        await ita.deferReply({ ephemeral: true })
        const tests = require('../../../test.json')
        var testarray = []
        for(var month in tests) {
            var dates = tests[month]
            for(var date in dates) {
                var subjects = dates[date]
                for(var subject in subjects) {
                    var test = subjects[subject]
                    let datex = new Date()
                    datex.setMonth(month, date)
                    datex.setHours(0, 0, 0, 0)
                    if(Date.now() > datex.getTime()) datex.setFullYear(datex.getFullYear() + 1)
                    testarray.push({
                        subject: subject,
                        type: test,
                        time: datex.getTime()
                    })
                }
            }
        }
        testarray.sort((a, b) => {
            if(a.time > b.time) return 1
            if(a.time == b.time) return 0
            if(a.time < b.time) return -1
        })
        var maxSubjectLength = 0
        testarray.forEach((test) => {
            let date = new Date()
            date.setTime(test.time)
            test.date = date.getDate()
            test.month = date.getMonth() + 1
            test.year = date.getFullYear()
            if(test.subject.length > maxSubjectLength) maxSubjectLength = test.subject.length
        })
        var text = []
        testarray.forEach(test => {
            var subject = test.subject
            var testtype = test.type
            var date = String(test.date)
            var month = String(test.month)
            while (subject.length < maxSubjectLength) subject += ' '
            while (testtype.length < 12) testtype = ` ${testtype}`
            while (date.length < 2) date = `0${date}`
            while (month.length < 2) month = `0${month}`
            if(!text.includes(`${test.year}`)) text.push(`${test.year}`)
            text.push(` ${subject} | ${date}.${month}. | ${testtype}`)
        })
        if(text.length == 0) text.push('Es stehen keine Tests an.')
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Tests')
            .setDescription(`\`\`\`\n${text.join('\n')}\`\`\``)
        await ita.editReply({embeds: [embed]})
    }
}
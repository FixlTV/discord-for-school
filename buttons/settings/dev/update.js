const discord = require('discord.js')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
    id: 'dev_settings_update',
    execute: async (ita, client) => {
        let embed = new discord.MessageEmbed()
            .setColor(client.color.lightblue)
            .setTitle('Update Manager')
            .setDescription('Drücke **⭳**, um die aktuellste Version herunterzuladen.')
            .setFooter('Achtung: Nach manchen Updates werden zusätzliche Informationen benötigt. Diese können nicht automatisch oder über Discord abgefragt werden, somit ist es ratsam, einen Blick in die Console zu werfen, wenn der Bot kurze Zeit nach dem Update nicht erreichbar ist.')
        let buttons = new discord.MessageActionRow()
            .addComponents(
                new discord.MessageButton()
                    .setCustomId('dev_settings')
                    .setLabel('❮')
                    .setStyle('DANGER'),
                new discord.MessageButton()
                    .setCustomId('dev_settings_update_run')
                    .setLabel('⭳')
                    .setStyle('SUCCESS')
            )
        await ita.update({ embeds: [embed], ephemeral: true, components: [buttons] })
        const collector = ita.message.createMessageComponentCollector({ max: 1 })
        collector.on('collect', async (button) => {
            if(button.customId == 'dev_settings') return
            await exec('git remote update')
            let out = await exec('git pull')
            var stdout = out.stdout
            let embed
            if(out.error) {
                embed = new discord.MessageEmbed()
                    .setColor(client.color.red)
                    .setTitle('Fehler')
                    .setDescription('Beim Pullen ist ein Fehler aufgetreten.\nBenutze **🗑**, um `git stash` auszuführen und das Update zu erzwingen.\n\n```\n' + out.error + '```')
                let buttons = new discord.MessageActionRow()
                    .addComponents(
                        new discord.MessageButton()
                            .setCustomId('dev_settings')
                            .setLabel('❮')
                            .setStyle('DANGER'),
                        new discord.MessageButton()
                            .setCustomId('dev_settings_update_stash')
                            .setLabel('🗑')
                            .setStyle('DANGER')
                    )
                await button.update({ embeds: [embed], ephemeral: true, components: [buttons] })
                button = await button.message.awaitMessageComponent()
                if(button.customId == 'dev_settings') return;
                let out = await exec('git stash')
                if(out.error) return button.update({ embeds: [new discord.MessageEmbed().setColor(client.color.red).setTitle('Fehler').setDescription('Beim Stashen ist ein unbekannter Fehler aufgetreten.\nDas Update wird abgebrochen.')], ephemeral: true, components: [buttons.spliceComponents(1, 1)] })
                out = await exec('git pull --force')
                if(out.error) return button.update({ embeds: [new discord.MessageEmbed().setColor(client.color.red).setTitle('Fehler').setDescription('Beim Pullen ist ein unbekannter Fehler aufgetreten.\nDas Update wird abgebrochen.')], ephemeral: true, components: [buttons.spliceComponents(1, 1)] })
                stdout = out.stdout
            }
            if(stdout?.toString().includes(',')) {
                embed = new discord.MessageEmbed()
                    .setColor(client.color.lime)
                    .setTitle('Update erfolgreich')
                    .setDescription('Das Update wurde erfolgreich heruntergeladen.\nDer Prozess wird nun neugestartet.')
                if(!button.replied) await button.update({ embeds: [embed], components: [] })
                else await button.editReply({ embeds: [embed], components: [] })
                process.exit(1)
            } else {
                embed = new discord.MessageEmbed()
                    .setColor(client.color.red)
                    .setTitle('Kein Update installiert')
                    .setDescription('Es ist kein Update verfügbar.')
                let buttons = new discord.MessageActionRow()
                    .addComponents(
                        new discord.MessageButton()
                            .setCustomId('dev_settings')
                            .setLabel('❮')
                            .setStyle('DANGER')
                    )
                if(!button.replied) await button.update({ embeds: [embed], components: [buttons] })
                else await button.editReply({ embeds: [embed], components: [buttons] })
            }
        })
    }
}
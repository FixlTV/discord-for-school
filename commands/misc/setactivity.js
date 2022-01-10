const embeds = require("../../embeds")

module.exports = {
    commands: 'setactivity',
    description: 'Ändert die Aktivtät.',
    modonly: 1,
    callback: (msg, args, client, sp, gb, ha, ts, data, userdata, embeds, config, color) => {
        msg.delete()
        client.user.setActivity(args.join(' '))
        embeds.success(msg, ':white_check_mark: Aktivität geändert', `Ich spiele jetzt **${args.join(' ')}**.`)
    }
}
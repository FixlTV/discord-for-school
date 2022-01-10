const fs = require('fs')
const path = require('path')
const { Client, MessageEmbed } = require('discord.js')
const axios = require('axios')

/**
 * 
 * @param {Client} client 
 */

module.exports = async function (client) {
    var commands = new Array()
    function readCommands(dir) {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files) {
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) readCommands(path.join(dir, file))
            else if(file.endsWith('.js') && !file.startsWith('xx')) {
                var command = require(path.join(__dirname, dir, file))
                command.path = path.join(__dirname, dir, file)
                if(typeof command.permissions === 'string') command.permissions = [command.permissions]
                if(command.name) {
                    console.log(`[${client.user.username}]: ${command.name} wird geladen...`)
                    if(command.permissions) validatePermissions(command, command.permissions)
                    commands.push(command)
                    client.slashCommands.set(command.name, command)
                }
                if(!command.name && command.commands) {
                    if(typeof command.commands === 'string') command.commands = [command.commands]
                    command.name = command.commands.shift()
                    console.log(`[${client.user.username}]: ${command.name} wird geladen...`)
                    if(command.permissions) validatePermissions(command, command.permissions)
                    commands.push(command)
                    client.slashCommands.set(command.name, command)
                }
            }
        }
    }

    readCommands('./slashcommands')

    console.log(`[${client.user.username}]: Commands werden hochgeladen.`)
    await client.guilds.fetch()
    for(var guild of client.guilds.cache) {
        guild[1].commands.set(commands)
    }
    console.log(`[${client.user.username}]: Commands aktiv.`)

    client.on('interactionCreate', async function(ita) {
        if(ita.isCommand()) {
            let command = client.slashCommands.get(ita.commandName)
            if(!command) return

            var args = {}
            ita.options._hoistedOptions.forEach(object => {
                args[object.name] = { value: object.value, type: object.type }
            })

            await command.run(ita, args, client).catch(error => {
                console.error(error)
                require('./embeds').error(ita, 'Fehler', 'Ein unbekannter Fehler ist aufgetreten.')
            })
        }
    })
}
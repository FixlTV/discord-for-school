const { error } = require("../../embeds")

module.exports = {
    name: 'clear',
    description: 'Löscht Nachrichten',
    options: [{
        type: 4,
        name: 'count',
        description: 'Anzahl der zu löschenden Nachrichten',
        required: true
    }],
    async run(ita, args, client) {
        error(ita, 'Fehler', 'Dieser Befehl ist aktuell noch in der Entwicklungsphase und nicht einsatzbereit.')
    }
}
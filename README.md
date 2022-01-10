# discord-for-school
Discord Bot für einfachere Organisation in der Schule. System basiert auf dem Bayerischen Lehrplan für naturwissenschaftlich-technische Gymnasien (G8, 10. Klasse) lässt sich jedoch durch Anpassungen auf andere Fächerkombinationen umstellen.

## Wichtige Information
Der "Code" hier ist relativ hässlich und nicht unbedingt optimal. Dieses Projekt gammelt seit einem Jahr im letzten Eck meiner Festplatte und ich habe aktuell wenig Motivation, ihn zu verbessern. Es gibt viele Dinge, die ich im Nachhinein ändern würde (u.a. was die JSON Files angeht), aber wie gesagt, einfach keine Lust. Vielleicht kommen in Zukunft noch ein paar Änderungen, aber nach einem halben Jahr nichts am Code verändern, weiß ich nur noch bedingt, was ich mir damals gedacht hab :)

## Installation
### 1 Repository clonen
`git clone https://github.com/FixlTV/discord-for-school`
### 2 config.json ändern
```js
{
    "token": "Discord Bot Token",     //Token des Bots
    "sendtime": 13,                   //Stunde, ab der der nächste Tag im "Dashboard" angezeigt wird
    "mods": ["Discord User IDs"],     //Moderatoren. Array mit User IDs
    "color": {                        //Farben für Embeds (lightblue für neutrale)
        "red": "0xED4245",
        "lightblue": "0x3498db",
        "lime": "0x57F287",
        "yellow": "0xFEE75C"
    },
    "channel": "Discord Channel ID"   //ID des Channels, in dem das Dashboard angezeigt werden soll
}
```
### 3 stundenplan.json einrichten
Jeder Tag ist ein Array, in dem jedes Fach, was an dem Tag vorkommt, einmal aufgeführt ist
```js
{
	"Montag": [ "Informatik", "Sport", "Physik" ],
	"Dienstag": [ "Biologie", "Mathematik", "Geschichte", "Englisch", "Deutsch" ],
	"Mittwoch": [ "Sozialkunde", "Französisch", "Latein", "Englisch" ],
	"Donnerstag": [ "Chemie", "Musik", "Kunst", "Mathematik", "Geographie" ],
	"Freitag": [ "Deutsch", "Chemie", "Physik", "Französisch", "Latein" ],
	"Samstag": [ "Keine" ],
	"Sonntag": [ "Keine" ]
}
```

## Verwendung
Mehr dazu vielleicht bald im Wiki

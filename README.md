# discord-for-school
Discord Bot für einfachere Organisation in der Schule. System basiert auf dem Bayerischen Lehrplan für naturwissenschaftlich-technische Gymnasien (G8, 10. Klasse) lässt sich jedoch durch Anpassungen auf andere Fächerkombinationen umstellen.

## Wichtige Information
Der "Code" hier ist relativ hässlich und nicht unbedingt optimal. Dieses Projekt gammelt seit einem Jahr im letzten Eck meiner Festplatte und ich habe aktuell wenig Motivation, ihn zu verbessern. Es gibt viele Dinge, die ich im Nachhinein ändern würde (u.a. was die JSON Files angeht), aber wie gesagt, einfach keine Lust. Vielleicht kommen in Zukunft noch ein paar Änderungen, aber nach einem halben Jahr nichts am Code verändern, weiß ich nur noch bedingt, was ich mir damals gedacht hab :)  
(Darum gibts jetzt auch ein vereinfachtes Setup, gar nicht ironisch)

## Installation
### 1 Repository clonen
`git clone https://github.com/FixlTV/discord-for-school`

### 2 stundenplan.json erstellen
Jeder Tag ist ein Array, in dem jedes Fach, was an dem Tag vorkommt, einmal aufgeführt ist.  
Aktuell müssen `slashcommands/main/hausaufgaben/ha.js` und `slashcommands/main/tests/test.js` überarbeitet werden, wenn andere Fächer verwendet werden wollen.
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

### 3 Node Modules installieren
```
npm i
```
### 4 Setup Assistant starten
```
node .
```
Alle anderen erforderlichen Dateien werden automatisch mit dem Setup Assistant erstellt.  
Die `config.json` benötigt Userinput, um z.B. den Token festzulegen.  
Nach Abschluss des Setup Assistant wird der Bot automatisch gestartet.
Danach kann der Bot mit `node .` gestartet werden.

## Verwendung
-> [Wiki](https://github.com/FixlTV/discord-for-school/wiki)

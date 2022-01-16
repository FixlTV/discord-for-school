# discord-for-school
Discord Bot für einfachere Organisation in der Schule. System basiert auf dem Bayerischen Lehrplan für naturwissenschaftlich-technische Gymnasien (G8, 10. Klasse) lässt sich jedoch durch Anpassungen auf andere Fächerkombinationen umstellen.

## Wichtige Information
Der "Code" hier ist relativ hässlich und nicht unbedingt optimal. Dieses Projekt gammelt seit einem Jahr im letzten Eck meiner Festplatte und ich habe aktuell wenig Motivation, ihn zu verbessern. Es gibt viele Dinge, die ich im Nachhinein ändern würde (u.a. was die JSON Files angeht), aber wie gesagt, einfach keine Lust. Vielleicht kommen in Zukunft noch ein paar Änderungen, aber nach einem halben Jahr nichts am Code verändern, weiß ich nur noch bedingt, was ich mir damals gedacht hab :)  
(Darum gibts jetzt auch ein vereinfachtes Setup, gar nicht ironisch)

## Installation
### 1 Vorbereitung
#### Repository clonen
`git clone https://github.com/FixlTV/discord-for-school`
#### Discord Bot
Der verwendete Bot benötigt das Application Command und Bot Scope, keine Privileged Gateway Intents und mindestens Send Messages Permissions.

### 2 Node Modules installieren
```
npm i
```
### 3 Setup Assistant starten
```
node .
```
Alle anderen erforderlichen Dateien werden mithilfe des Setup Assistant erstellt.  
Nach Abschluss des Setup Assistant wird der Bot automatisch gestartet (Errors kommen, wenn man das Setup trotz Assistant verkackt hat).

Danach kann der Bot mit `node .` gestartet werden.

## Verwendung
-> [Wiki](https://github.com/FixlTV/discord-for-school/wiki)

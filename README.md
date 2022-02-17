# discord-for-school
Discord Bot für einfachere Organisation in der Schule. Vollständig variables System mit bis zu 25 Fächern und 25 unterschiedlichen Leistungserhebungsarten (wozu auch immer man die 25 braucht).  
Beinhaltet tägliche Informationen über am nächsten Tag anstehende Leistungserhebungen, Hausaufgaben, Geburtstage und Fächer und ein paar andere Sachen :)

## Wichtige Information
Der "Code" hier ist relativ hässlich und nicht unbedingt optimal. Dieses Projekt gammelt seit einem Jahr im letzten Eck meiner Festplatte und ich habe aktuell wenig Motivation, ihn zu verbessern. Es gibt viele Dinge, die ich im Nachhinein ändern würde (u.a. was die JSON Files angeht), aber wie gesagt, einfach keine Lust. Vielleicht kommen in Zukunft noch ein paar Änderungen, aber nach einem halben Jahr nichts am Code verändern, weiß ich nur noch bedingt, was ich mir damals gedacht hab :)  
(Darum gibts jetzt auch lauter neue Sachen, gar nicht ironisch)  

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

## Lizenz
   Copyright 2022 FixlTV

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

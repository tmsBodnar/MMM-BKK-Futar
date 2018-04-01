# MMM-BKK-Futar

Magic Mirror modul, mely információt ad adott megálló indulási adatairól.
https://github.com/MichMich/MagicMirror

Telepítés:
Bemásolni a Magic Mirror /modules mappába,
vagy a modules mappában futtatni: 
```
git clone https://github.com/Tms-bodnar/MMM-BKK-Futar.git
```
majd 
```
npm install
```
MagicMirror/config mappa config.js-hez hozzáadni:
```
{
        module: 'MMM-BKK-Futar',
        header: 'Menetrend',
        position: 'middle_center',
        config: {
            stopNumber: Buszmegálló kódja(i),  // Pl: ["BKK_F03308", "BKK_F03420", "BKK_F03340"]
        }
    }
```
![alt text](https://github.com/Tms-bodnar/MMM-BKK-Futar/blob/master/MMM-BKK-Futar/MMM-BKK-Futar.png)

Első javascript kódom, köszönöm az inspirációt és a kódmintákat:
- dr4ke616 https://github.com/dr4ke616/MMM-Dublin-Bus
- mefiblogger https://github.com/mefiblogger/KoviBusz

használd, írd át, csinálj jobbat :-)

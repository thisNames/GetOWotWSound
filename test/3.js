const s = Date.now();

const fs = require("node:fs");
const pt = require("node:path");

// 并集
const sumSet = new Set();

// 交集
const interSet = new Set();

// 差集
const subSet = new Set();

const wemFiles = [];
const defWemFiles = [];

function totalWemFiles()
{
    const wp = "F:\\Games\\SteamF\\steamapps\\common\\Ori and the Will of the Wisps\\oriwotw_Data\\StreamingAssets\\Audio\\GeneratedSoundBanks\\Windows";

    const list = fs.readdirSync(wp, { encoding: "utf-8" });

    for (let i = 0; i < list.length; i++)
    {
        const item = list[i];
        const [name, ext] = pt.basename(item).split(".");

        if (ext == "wem")
        {
            wemFiles.push(name);
            !sumSet.has(name) && sumSet.add(name);
        }
    }
}

function totalDefWemFiles()
{
    const SoundbanksInfo = require("./SoundbanksInfo.json");

    for (let i = 0; i < SoundbanksInfo.SoundBanksInfo.StreamedFiles.length; i++)
    {
        const element = SoundbanksInfo.SoundBanksInfo.StreamedFiles[i];

        defWemFiles.push(element.Id);
        !sumSet.has(element.Id) || sumSet.add(element.Id);
    }
}


function init()
{
    totalWemFiles();
    totalDefWemFiles();

    console.log(wemFiles.length, defWemFiles.length);
    console.log("并集:", sumSet.size);

    const defWemFilesSet = new Set(defWemFiles);
    const diff1 = wemFiles.filter(id => !defWemFilesSet.has(id));

    const wemFilesSet = new Set(wemFiles);

    const diff2 = defWemFiles.filter(id => !wemFilesSet.has(id));

    console.log("差集1:", diff1.length);
    console.log("差集2:", diff2.length);


    const interSet1 = wemFiles.filter((value) => defWemFilesSet.has(value));
    const interSet2 = defWemFiles.filter((value) => wemFilesSet.has(value));

    console.log("交集1:", interSet1.length);
    console.log("交集2:", interSet2.length);


    /**
     *  2425 2272
     *  并集: 2425
     *  差集1: 153
     *  差集2: 0
     *  交集1: 2272
     *  交集2: 2272
     *  51 ms
     */

    diff1.forEach(id => console.log(id));
}


// const json = require("F:\\Games\\SteamF\\steamapps\\common\\Ori and the Will of the Wisps\\oriwotw_Data\\StreamingAssets\\Audio\\GeneratedSoundBanks\\Windows\\SoundbanksInfo.json");

// console.log(json.SoundBanksInfo.StreamedFiles.length);
// console.log(json.SoundBanksInfo.SoundBanks.length);


class BBB
{
    constructor()
    {

    }

    aaa()
    {
        console.log(BBB.name);

    }

}

// console.log(process.argv);
new BBB().aaa()


console.log(Date.now() - s, "ms");

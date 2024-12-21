const namespace = require("../class");

/**
 * 获取 wem 和 bnk 文件的数量
 * @returns { {wem: Number, bnk:Number} }
 */
function getAllCount()
{
    const { SoundBanksInfo } = namespace.SoundbanksInfoJson;

    return {
        wem: SoundBanksInfo.StreamedFiles.length,
        bnk: SoundBanksInfo.SoundBanks.length
    }
}

function printWemCount()
{
    const { wem } = getAllCount();
    const line = `.wem 文件的数量为：\t${wem}`;
    console.log(line);
}

function printBnkCount()
{
    const { bnk } = getAllCount();
    const line = `.bnk 文件的数量为：\t${bnk}`;
    console.log(line);
}

module.exports = {
    printBnkCount,
    printWemCount,
    getAllCount
}

const pt = require("node:path");

const Logger = require("../../../class/Logger");

const Utils = require("../class/Utils");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");
const DefaultConfig = require("../class/DefaultConfig");

const CFG = require("../config/default_config");
const OPT = require("../options/options");
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);

/**
 *  查找重复定义的文件
 *  @returns {void}
 */
function duplicate()
{
    /** @type {SoundBanksInfoData} 数据对象 */
    const soundBnkInfoData = SoundBnkInfoCacheLoader.loader(GameSoundBnkInfo, DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName, OPT.searchEnum);

    // 加载失败
    if (soundBnkInfoData instanceof Error) return Logger.error(soundBnkInfoData.message);

    // SoundBanks 中的 StreamedFiles 集合
    const listSBStreamedFile = soundBnkInfoData.lSBKToLSF(soundBnkInfoData.listSoundBank);

    // 查找 StreamedFiles 中重复定义的文件
    const listStreamedFileRept = Utils.findDuplicates(soundBnkInfoData.listStreamedFile, value => value.ShortName);
    const listSBStreamedFileRept = Utils.findDuplicates(listSBStreamedFile, value => value.ShortName);

    // 输出结果
    Utils.formatOutputObject({
        key: "ShortName",
        wemRepeat: listStreamedFileRept.length,
        bnkInWemRepeat: listSBStreamedFileRept.length
    }).forEach(item => Logger.info(item.fKey, "=>", item.value));
}

module.exports = duplicate;

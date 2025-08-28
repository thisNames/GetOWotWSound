const pt = require("node:path");

const Logger = require("../../../class/Logger");
const Tools = require("../../../class/Tools");

const Utils = require("../class/Utils");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");
const DefaultConfig = require("../class/DefaultConfig");
const SaverUtils = require("../class/SaverUtils");
const StreamedFile = require("../class/StreamedFile");

const CFG = require("../config/default_config");
const OPT = require("../options/options");

const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);
const DuplicateID = Tools.generateHashId(8);
const SaverSFFilename = "DuplicateStreamedFiles_" + DuplicateID;
const SaverSBKFilename = "DuplicateSoundBanks_" + DuplicateID;

/**
 *  保存重复定义的文件
 *  @param {Array<StreamedFile>} listStreamedFile StreamedFile 对象集合
 */
function duplicateSaver(listStreamedFile, filename)
{
    /** @type {Array<{name: String, result: SaverResult | Error}>} 保存委托结果 */
    const drs = [];
    const filePath = pt.join(process.cwd(), filename);

    // 保存到 json
    if (OPT.enableSSjson)
    {
        const jsr = SaverUtils.saverLSFDelegate(listStreamedFile, filePath + ".json", SaverUtils.saverLSFJson);
        drs.push({ name: "json", result: jsr });
    }

    // 保存到 csv
    if (OPT.enableSScsv)
    {
        const csr = SaverUtils.saverLSFDelegate(listStreamedFile, filePath + ".csv", SaverUtils.saverLSFCsv);
        drs.push({ name: "csv", result: csr });
    }

    // 格式化输出
    drs.forEach(item =>
    {
        if (item.result instanceof Error) return Logger.error(item.name, item.result.message);
        Utils.formatOutputObject(item.result).forEach(line => Logger.info(item.name, line.fKey, "=>", line.value));
    });
}

/**
 *  查找重复定义的文件 Id
 *  @param {SoundBanksInfoData} soundBnkInfoData SoundBanksInfoData 数据对象
 *  @returns {Array<Array<StreamedFile>>} 0 - listStreamedFileRept, 1 - listSBStreamedFileRept
 */
function duplicateForId(soundBnkInfoData)
{
    // SoundBanks 中的 StreamedFiles 集合
    const listSBStreamedFile = soundBnkInfoData.lSBKToLSF(soundBnkInfoData.listSoundBank);

    // 查找 StreamedFiles 中重复定义的文件
    const listStreamedFileRept = Utils.findDuplicates(soundBnkInfoData.listStreamedFile, value => value.Id);
    const listSBStreamedFileRept = Utils.findDuplicates(listSBStreamedFile, value => value.Id);

    return [listStreamedFileRept, listSBStreamedFileRept];
}

/**
 *  查找重复定义的文件 ShortName
 *  @param {SoundBanksInfoData} soundBnkInfoData SoundBanksInfoData 数据对象
 *  @returns {Array<Array<StreamedFile>>} 0 - listStreamedFileRept, 1 - listSBStreamedFileRept
 */
function duplicateForShortName(soundBnkInfoData)
{
    // SoundBanks 中的 StreamedFiles 集合
    const listSBStreamedFile = soundBnkInfoData.lSBKToLSF(soundBnkInfoData.listSoundBank);

    // 查找 StreamedFiles 中重复定义的文件
    const listStreamedFileRept = Utils.findDuplicates(soundBnkInfoData.listStreamedFile, value => value.ShortName);
    const listSBStreamedFileRept = Utils.findDuplicates(listSBStreamedFile, value => value.ShortName);

    return [listStreamedFileRept, listSBStreamedFileRept];
}

/**
 *  查找重复定义的文件 Id + ShortName
 *  @param {SoundBanksInfoData} soundBnkInfoData SoundBanksInfoData 数据对象
 *  @returns {Array<Array<StreamedFile>>} 0 - listStreamedFileRept, 1 - listSBStreamedFileRept
 */
function duplicateForIdAndShortName(soundBnkInfoData)
{
    // SoundBanks 中的 StreamedFiles 集合
    const listSBStreamedFile = soundBnkInfoData.lSBKToLSF(soundBnkInfoData.listSoundBank);

    // 查找 StreamedFiles 中重复定义的文件
    const listStreamedFileRept = Utils.findDuplicates(soundBnkInfoData.listStreamedFile, value => value.Id + value.ShortName);
    const listSBStreamedFileRept = Utils.findDuplicates(listSBStreamedFile, value => value.Id + value.ShortName);

    return [listStreamedFileRept, listSBStreamedFileRept];
}

/**
 *  查找重复定义的文件委托
 *  @returns {{key: String, action: (soundBnkInfoData: SoundBanksInfoData) => Array<Array<StreamedFile>>}}
 */
function duplicatesDelegate()
{
    if (OPT.duplicateEnum == 0) return { key: "Id", action: duplicateForId };
    if (OPT.duplicateEnum == 1) return { key: "ShortName", action: duplicateForShortName };
    return { key: "Id & ShortName", action: duplicateForIdAndShortName };
}

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
    const duplicateAction = duplicatesDelegate();
    const actonResult = duplicateAction.action(soundBnkInfoData);

    // 查找 StreamedFiles 中重复定义的文件
    const listStreamedFileRept = actonResult[0] || [];
    const listSBStreamedFileRept = actonResult[1] || [];

    // 输出结果
    Utils.formatOutputObject({
        searchEnum: OPT.searchEnum,
        key: duplicateAction.key,
        wemRepeat: listStreamedFileRept.length,
        bnkInWemRepeat: listSBStreamedFileRept.length
    }).forEach(item => Logger.info(item.fKey, "=>", item.value));

    // 保存结果
    duplicateSaver(listStreamedFileRept, SaverSFFilename);
    duplicateSaver(listSBStreamedFileRept, SaverSBKFilename);
}

module.exports = duplicate;

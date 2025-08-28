const fs = require("node:fs");
const pt = require("node:path");

const Logger = require("../../../class/Logger");
const Tools = require("../../../class/Tools");

const DefaultConfig = require("../class/DefaultConfig");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const Utils = require("../class/Utils");
const SaverUtils = require("../class/SaverUtils");
const StreamedFile = require("../class/StreamedFile");

const CFG = require("../config/default_config");
const OPT = require("../options/options");

const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);
const DifferenceID = Tools.generateHashId(8);
const DifferenceSaverName = "UndefinedStreamedFiles_" + DifferenceID;


/**
 *  将 wem 文件 ID 转换为 StreamedFile 对象
 *  @param {Array<String>} listWemId wem 文件 ID 集合
 *  @returns {Array<StreamedFile>} StreamedFile 对象集合
 */
function wemToStreamedFiles(listWemId)
{
    const listStreamedFile = [];

    listWemId.forEach(id => listStreamedFile.push(new StreamedFile(id, "undefined\\" + id + ".wav", "StreamedFiles", "")));

    return listStreamedFile;
}

/**
 *  保存未定义的 wem 文件
 *  @description 保存到 json
 *  @param {Array<StreamedFile>} listStreamedFile StreamedFile 对象集合
 */
function differenceSaver(listStreamedFile)
{
    /** @type {Array<{name: String, result: SaverResult | Error}>} 保存委托结果 */
    const drs = [];
    const filePath = pt.join(process.cwd(), DifferenceSaverName);
    const data = Utils.createStreamedFilesStruct(listStreamedFile);

    // 保存到 json
    if (OPT.enableSSjson)
    {
        const jsr = SaverUtils.saverDelegate(SaverUtils.saverObjectToJson, data, filePath + ".json");
        drs.push({ name: "json", result: jsr });
    }

    // 格式化输出
    drs.forEach(item =>
    {
        if (item.result instanceof Error) return Logger.error(item.name, item.result.message);
        Utils.formatOutputObject(item.result).forEach(line => Logger.info(item.name, line.fKey, "=>", line.value));
    });
}

/**
 *  查找所有wem文件
 *  @returns {Set<String>}
 */
function getSoundAssetAllWemFile()
{
    const result = new Set();

    // 遍历目录
    try
    {
        fs.readdirSync(CFG.soundAssetsPath, { encoding: "utf-8", withFileTypes: true }).forEach(item =>
        {
            if (!item.isFile()) return;

            const [filename = "", extname = ""] = item.name.split(".");

            if (extname == "wem") result.add(filename);
        });
    } catch (error)
    {
        return result;
    }

    return result;
}

/**
 *  查找未定义的文件
 *  @returns {void}
 */
function difference()
{
    /** @type {SoundBanksInfoData} 数据对象 */
    const soundBnkInfoData = SoundBnkInfoCacheLoader.loader(GameSoundBnkInfo, DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName, OPT.searchEnum);

    // 加载失败
    if (soundBnkInfoData instanceof Error) return Logger.error("difference =>", soundBnkInfoData.message);

    const listSBStreamedFile = soundBnkInfoData.lSBKToLSF(soundBnkInfoData.listSoundBank);
    const listWemIDSet = getSoundAssetAllWemFile();

    // 查找未定义的文件
    soundBnkInfoData.listStreamedFile.forEach(item => listWemIDSet.has(item.Id) && listWemIDSet.delete(item.Id));
    listSBStreamedFile.forEach(item => listWemIDSet.has(item.Id) && listWemIDSet.delete(item.Id));

    // 格式化输出
    Utils.formatOutputObject({
        searchEnum: OPT.searchEnum,
        undefinedWem: listWemIDSet.size,
    }).forEach(line => Logger.info(line.fKey, "=>", line.value));

    // 保存
    differenceSaver(wemToStreamedFiles(Array.from(listWemIDSet)));
}

module.exports = difference;

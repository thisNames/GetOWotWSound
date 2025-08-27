const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Tools = require("../../../class/Tools");

const DefaultConfig = require("../class/DefaultConfig");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const PagePrinter = require("../class/PagePrinter");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");
const StreamedFile = require("../class/StreamedFile");
const Utils = require("../class/Utils");
const SaverUtils = require("../class/SaverUtils");

const CFG = require("../config/default_config");
const OPT = require("../options/options");

const SearchID = Tools.generateHashId(8);
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);
const SaverFilename = "SearchSession_" + SearchID;

/**
 *  保存搜索结果为 log 的数据回调
 *  @param {StreamedFile} item 流文件对象
 *  @param {Number} i 索引
 *  @returns {String}
 */
function loggerCallback(item, i)
{
    const title = `${i + 1}: [${item.Type}] [${item.BnkFile}] #${item.Id}`;
    const content = "\t-> " + item.ShortName;
    const data = title + "\r\n" + content;

    return data;
}

/**
 *  搜索
 *  @param {String} searchName 搜索名称
 *  @param {LoggerSaver} logger 日志记录器
 *  @returns {Array<StreamedFile>}
 */
function search(searchName, logger)
{
    /** @type {SoundBanksInfoData} 数据对象 */
    const soundBnkInfoData = SoundBnkInfoCacheLoader.loader(GameSoundBnkInfo, DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName, OPT.searchEnum);

    // 加载所有失败
    if (soundBnkInfoData instanceof Error)
    {
        logger.error(soundBnkInfoData.message);
        return [];
    }

    // 开始搜索
    let result = null;

    const listStreamedFile = soundBnkInfoData.searchStreamedFile(searchName, OPT.enableSIgnoreCase);
    const listSoundBank = soundBnkInfoData.searchSoundBank(searchName, OPT.enableSIgnoreCase);

    result = listSoundBank;
    if (listStreamedFile.length > 0) result.push(...listStreamedFile);

    // 空集合
    if (result.length < 1)
    {
        logger.heighLight(`Search ${searchName} is Empty`, [searchName]);
        return [];
    }

    return result;
}

/**
 *  保存搜索结果
 *  @param {Array<StreamedFile>} listStreamedFile 流文件对象集合
 *  @param {LoggerSaver} logger 日志记录器
 *  @returns {void}
 */
function searchSaver(listStreamedFile, logger)
{
    /** @type {Array<{name: String, result: SaverResult | Error}>} 保存委托结果 */
    const drs = [];
    const filePath = pt.join(process.cwd(), SaverFilename);

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

    // 保存到 log
    if (OPT.enableSSlog)
    {
        const lsr = SaverUtils.saverDelegate(SaverUtils.saverLSFLog, listStreamedFile, filePath + ".log", loggerCallback);
        drs.push({ name: "log", result: lsr });
    }

    // 格式化输出
    drs.forEach(item =>
    {
        if (item.result instanceof Error) return logger.error(item.name, item.result.message);
        Utils.formatOutputObject(item.result).forEach(line => logger.info(item.name, line.fKey, "=>", line.value));
    });
}

/**
 *  搜索内容
 *  @param {Array<String>} params 参数集合
 *  @returns {void}
 */
async function main(params)
{
    const logger = new LoggerSaver();
    const searchName = Utils.trim(params[0]);

    // 检查搜索的名称不为空
    if (searchName === "")
    {
        logger.error("必须有一个有效的搜索名");
        return;
    }

    // 搜索
    const result = search(searchName, logger);

    // 等待退出
    const pp = new PagePrinter(result, 2);
    await pp.printer((item, i) =>
    {
        const title = `${i + 1}: [${item.Type}] [${item.BnkFile}] #${item.Id}`;
        const content = "\t-> " + item.ShortName;

        logger
            .heighLight(title, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GREEN)
            .heighLight(content, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GRAY);
    });

    // 保存
    searchSaver(result, logger);
}

module.exports = main;

const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Tools = require("../../../class/Tools");

const DefaultConfig = require("../class/DefaultConfig");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const PagePrinter = require("../class/PagePrinter");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");
const StreamedFile = require("../class/StreamedFile");
const Utils = require("../class/Utils");

const CFG = require("../config/default_config");
const OPT = require("../options/options");

const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);
const SaverFilename = "SearchSession_" + Tools.generateHashId(8);

/**
 * @description 保存结果
 * @typedef SaverResult
 * @property {Number} size 大小
 * @property {String} path 路径
 */

/**
 *  保存搜索结果为 json
 *  @param {Array<StreamedFile>} listStreamedFile 流文件对象
 *  @returns {SaverResult}
 */
function saverToJson(listStreamedFile)
{
    const saverPath = pt.join(process.cwd(), SaverFilename + ".json");
    const data = JSON.stringify(listStreamedFile);
    const size = Tools.formatBytes(Buffer.byteLength(data, "binary"));

    fs.writeFileSync(saverPath, data, { encoding: "binary", flag: "w" });

    return { size: size.value + size.type, path: saverPath };
}

/**
 *  保存搜索结果为 log
 *  @param {Array<StreamedFile>} listStreamedFile 流文件对象
 *  @returns {SaverResult}
 */
function saverToLog(listStreamedFile)
{
    let bytes = 0;
    const saverPath = pt.join(process.cwd(), SaverFilename + ".log");
    const fd = fs.openSync(saverPath, "w");

    // 写入内容
    for (let i = 0; i < listStreamedFile.length; i++)
    {
        const item = listStreamedFile[i];
        const title = `${i + 1}: [${item.Type}] [${item.BnkFile}] #${item.Id}`;
        const content = "\t-> " + item.ShortName;
        const data = title + "\r\n" + content + "\r\n";

        bytes += Buffer.byteLength(data, "binary");
        fs.writeSync(fd, data, null, "utf-8");
    }

    fs.closeSync(fd);

    let size = Tools.formatBytes(bytes);

    return { size: size.value + size.type, path: saverPath };
}

/**
 *  保存搜索结果为 csv
 *  @param {Array<StreamedFile>} listStreamedFile 流文件对象
 *  @returns {SaverResult}
 */
function saverToCsv(listStreamedFile)
{
    let bytes = 0;
    const tableTitle = "Id,ShortName,Type,BnkFile\r\n";
    const saverPath = pt.join(process.cwd(), SaverFilename + ".csv");
    const fd = fs.openSync(saverPath, "w");

    // 写入表头
    bytes += Buffer.byteLength(tableTitle, "binary");
    fs.writeSync(fd, tableTitle, null, "utf-8");

    // 写入内容
    for (let i = 0; i < listStreamedFile.length; i++)
    {
        const item = listStreamedFile[i];
        const line = `"${item.Id}","${item.ShortName}","${item.Type}","${item.BnkFile}"\r\n`;

        bytes += Buffer.byteLength(line, "binary");
        fs.writeSync(fd, line, null, "utf-8");
    }

    fs.closeSync(fd);

    let size = Tools.formatBytes(bytes);

    return { size: size.value + size.type, path: saverPath };

}

/**
 *  委托保存
 *  @param {Array<StreamedFile>} result 流文件对象
 *  @param {(result: Array<StreamedFile>) => SaverResult} saver 
 *  @returns {SaverResult | Error} 
 */
function saverDelegate(result, saver)
{
    try
    {
        return saver(result);
    } catch (error)
    {
        return new Error("SaverDelegate => " + error.message);
    }
}

/**
 *  搜索
 *  @param {String} searchName 搜索名称
 *  @param {LoggerSaver} logger 日志记录器
 *  @returns {Promise<Array<StreamedFile>>}
 */
async function search(searchName, logger)
{
    /** @type {SoundBanksInfoData} */
    let soundBnkInfoData = null;
    const cacheLoaders = new SoundBnkInfoCacheLoader(GameSoundBnkInfo);

    // 枚举
    if (OPT.searchEnum == 0)
    {
        // 搜索 StreamedFile
        logger.light("Search >> StreamedFile");
        soundBnkInfoData = cacheLoaders.loaderStreamedFiles(DefaultConfig.cacheStreamedFilesName);
    }
    else if (OPT.searchEnum == 1)
    {
        // 搜索 SoundBank
        logger.light("Search >> SoundBank");
        soundBnkInfoData = cacheLoaders.loaderSoundBanks(DefaultConfig.cacheSoundBanksName);
    }
    else
    {
        // 搜索全部
        logger.light("Search >> All");
        soundBnkInfoData = cacheLoaders.loaders(DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName);
    }

    // 清除缓存
    cacheLoaders.clearCache();

    // 加载所有失败
    if (soundBnkInfoData instanceof Error)
    {
        logger.error(soundBnkInfoData.message);
        return Promise.resolve([]);
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
        return Promise.resolve([]);
    }

    const pp = new PagePrinter(result, 2);

    await pp.printer((item, i) =>
    {
        const title = `${i + 1}: [${item.Type}] [${item.BnkFile}] #${item.Id}`;
        const content = "\t-> " + item.ShortName;

        logger
            .heighLight(title, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GREEN)
            .heighLight(content, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GRAY);
    });

    return Promise.resolve(result);
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

    // 等待退出
    const result = await search(searchName, logger);

    /** @type {{name: String, result: SaverResult | Error}[]} 保存委托结果 */
    const delegateResults = [];

    // 保存到 json
    OPT.enableSSjson && delegateResults.push({ name: "json", result: saverDelegate(result, saverToJson) });
    // 保存到 log
    OPT.enableSSlog && delegateResults.push({ name: "log", result: saverDelegate(result, saverToLog) });
    // 保存到 csv
    OPT.enableSScsv && delegateResults.push({ name: "csv", result: saverDelegate(result, saverToCsv) });

    // 格式化输出
    delegateResults.forEach(item =>
    {
        if (item.result instanceof Error) return logger.error(item.name, item.result.message);
        Utils.formatOutputObject(item.result).forEach(line => logger.info(item.name, line.fKey, "=>", line.value));
    });
}

module.exports = main;

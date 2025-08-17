const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");
const Loading = require("../../../class/Loading");
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
const SaverFilename = "SearchResult_" + Tools.generateHashId(8);

/**
 *  保存搜索结果为 json
 *  @param {Array<StreamedFile>} listStreamedFile 流文件对象
 *  @returns {{ size: String, path: String}}
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
 *  @returns {{ size: String, path: String}}
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
 *  @returns {{ size: String, path: String}}
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
 *  搜索
 *  @param {String} searchName 搜索名称
 *  @param {LoggerSaver} logger 日志记录器
 *  @returns {Promise<Array<StreamedFile>>}
 */
async function search(searchName, logger)
{
    /** @type {SoundBanksInfoData} */
    let soundBnkInfoData = null;

    const loading = new Loading();
    const cacheLoaders = new SoundBnkInfoCacheLoader(GameSoundBnkInfo);

    // 枚举
    loading.start("s");
    if (OPT.searchEnum == 0)
    {
        // 搜索 StreamedFile
        logger.light("Search->StreamedFile");
        soundBnkInfoData = cacheLoaders.loaderStreamedFiles(DefaultConfig.cacheStreamedFilesName);
    }
    else if (OPT.searchEnum == 1)
    {
        // 搜索 SoundBank
        logger.light("Search->SoundBank");
        soundBnkInfoData = cacheLoaders.loaderSoundBanks(DefaultConfig.cacheSoundBanksName);
    }
    else
    {
        // 搜索全部
        logger.light("Search->All");
        soundBnkInfoData = cacheLoaders.loaders(DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName);
    }

    // 清除缓存
    cacheLoaders.clearCache();

    // 加载所有失败
    if (soundBnkInfoData instanceof Error)
    {
        logger.error("Search =>" + soundBnkInfoData.message || "error");
        loading.stop(false, "Error");
        return Promise.resolve([]);
    }

    // 开始搜索
    let result = null;

    const listStreamedFile = soundBnkInfoData.searchStreamedFile(searchName, OPT.enableIgnoreCase);
    const listSoundBank = soundBnkInfoData.searchSoundBank(searchName, OPT.enableIgnoreCase);

    result = listSoundBank;
    if (listStreamedFile.length > 0) result.push(...listStreamedFile);

    // 空集合
    if (result.length < 1)
    {
        logger.info("什么也没用找到，试试别的吧~");
        loading.stop(false, "Empty");
        return Promise.resolve([]);
    }

    // 成功
    loading.stop(true, `Total: ${result.length} Times:`);

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
 *  搜索全部
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 *  @returns {void}
 */
async function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver();
    const searchName = Utils.trim(params[0]);
    const loading = new Loading();

    // 检查搜索的名称不为空
    if (searchName === "")
    {
        logger.error(taskName + " 语法错误，必须有一个搜索名");
        return;
    }

    // 等待退出
    const result = await search(searchName, logger);

    // 保存到 json
    if (OPT.enableSScsv || OPT.enableSSjson || OPT.enableSSlog) loading.start("SearchSaver");
    if (OPT.enableSSjson)
    {
        try
        {
            const o = saverToJson(result, logger);
            logger
                .success("saverToJson:", o.path)
                .light("Size:", o.size);
        } catch (error)
        {
            logger.error("saverToJson =>", error.message || "error");
        }
    }
    // 保存到 log
    if (OPT.enableSSlog)
    {
        try
        {
            const o = saverToLog(result);
            logger
                .success("saverToLog:", o.path)
                .light("Size:", o.size);
        } catch (error)
        {
            logger.error("saverToLog =>", error.message || "error");
        }
    }
    // 保存到 csv
    if (OPT.enableSScsv)
    {
        try
        {
            const o = saverToCsv(result);
            logger
                .success("saverToCsv:", o.path)
                .light("Size:", o.size);
        } catch (error)
        {
            logger.error("saverToCsv =>", error.message || "error");
        }
    }
    loading.stop(true, "SaverTimes:");
}

module.exports = main;

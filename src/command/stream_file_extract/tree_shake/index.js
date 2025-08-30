const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Tools = require("../../../class/Tools");

const StreamedFilesJsonLoader = require("../class/StreamedFilesJsonLoader");
const DefaultConfig = require("../class/DefaultConfig");
const Utils = require("../class/Utils");

const CFG = require("../config/default_config");

// 保存文件
const CacheFolder = pt.join(Utils.getResourcePath(), "cache");
const ListStreamedFileSavePath = pt.join(CacheFolder, DefaultConfig.cacheStreamedFilesName);
const ListSoundBankSavePath = pt.join(CacheFolder, DefaultConfig.cacheSoundBanksName);
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);

/**
 *  生成缓存文件
 *  @returns {void}
 */
function cacheGenerator()
{
    const logger = new LoggerSaver().info("cacheGenerator");
    const loader = new StreamedFilesJsonLoader(GameSoundBnkInfo);
    const startTime = Date.now();

    // 读取 SoundBnkInfo 文件信息
    let listStreamedFile = null, listSoundBank = null;
    try
    {
        listStreamedFile = loader.loaderStreamedFiles();
        listSoundBank = loader.loaderSoundBanks();
        loader.clearCache();
    } catch (error)
    {
        logger.error(error.message);
        return;
    }

    // 保存到缓存目录
    let d1 = "", d2 = "";
    try
    {
        d1 = JSON.stringify(Utils.createStreamedFilesStruct(listStreamedFile));
        d2 = JSON.stringify(Utils.createSoundBanksStruct(listSoundBank));

        fs.writeFileSync(ListStreamedFileSavePath, d1, { encoding: "utf-8", flag: "w" });
        fs.writeFileSync(ListSoundBankSavePath, d2, { encoding: "utf-8", flag: "w" });
    } catch (error)
    {
        logger.error(error.message);
        return;
    }

    // 统计大小
    const originSize = Tools.formatBytes(fs.statSync(GameSoundBnkInfo).size);
    const cacheSize = Tools.formatBytes(Buffer.byteLength(d1, "binary") + Buffer.byteLength(d2, "binary"));

    // 格式化输出
    Utils.formatOutputObject({
        originSize: originSize.value + originSize.type,
        cacheSize: cacheSize.value + cacheSize.type,
        listStreamedFile: loader.streamedFileCount,
        bnk: loader.soundBankCount,
        listSoundBank: loader.soundBankStreamedFileCount,
        totalStreamedFile: loader.streamedFileCount + loader.soundBankStreamedFileCount,
        timeMS: Date.now() - startTime
    }).forEach(line => logger.info(line.fKey, "=>", line.value));
}

/**
 *  清除缓存文件
 *  @returns {void}
 */
function clearCacheFile()
{
    const logger = new LoggerSaver().info("clearCacheFile");
    const delHash = Tools.generateHashId(8);
    const delExtname = ".temp";

    let ddc = 0;

    try
    {
        // 并不会删除
        if (fs.existsSync(ListStreamedFileSavePath))
        {
            fs.renameSync(ListStreamedFileSavePath, ListStreamedFileSavePath + "." + delHash + delExtname);
            ddc++;
        }
        if (fs.existsSync(ListSoundBankSavePath))
        {
            fs.renameSync(ListSoundBankSavePath, ListSoundBankSavePath + "." + delHash + delExtname);
            ddc++;
        }
    } catch (error)
    {
        logger.error(error.message);
        return;
    }

    // 格式化输出
    Utils.formatOutputObject({
        hash: delHash,
        ext: delExtname,
        clearTotal: ddc
    }).forEach(line => logger.info(line.fKey, "=>", line.value));
}

/**
 *  删除缓存文件
 *  @returns {void}
 */
async function deleteCacheFile()
{
    const logger = new LoggerSaver().info("deleteCacheFile");
    const listDelItem = [];
    const delExtname = ".temp";
    const oks = ["y", "yes"];

    // 读取目录
    try
    {
        const listDirent = fs.readdirSync(CacheFolder, { encoding: "utf-8", withFileTypes: true });
        listDirent.forEach(dirent => dirent.isFile() && pt.extname(dirent.name) == delExtname && listDelItem.push(pt.join(CacheFolder, dirent.name)));
    } catch (error)
    {
        logger.error(error.message)
        return;
    }

    // 空
    if (listDelItem.length < 1)
    {
        logger.warn("Cache is empty");
        return;
    }

    // 列表
    listDelItem.forEach(filePath => logger.info(filePath));
    logger.info("Del?:", oks.join("/"));

    // 等待输入
    const input = await Tools.terminalInput().catch(m => m + "");

    // 取消删除
    if (!oks.includes(input))
    {
        logger.warn("Cancel");
        return;
    }

    // 删除
    for (let i = 0; i < listDelItem.length; i++)
    {
        const filePath = listDelItem[i];

        try
        {
            fs.rmSync(filePath);
            logger.info("Del", i + 1, filePath);
        } catch (error)
        {
            logger.error(error.message);
        }
    }
}

module.exports = {
    cacheGenerator,
    clearCacheFile,
    deleteCacheFile
};

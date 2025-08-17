const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Tools = require("../../../class/Tools");

const StreamedFilesJsonLoader = require("../class/StreamedFilesJsonLoader");
const DefaultConfig = require("../class/DefaultConfig");
const Utils = require("../class/Utils");

const CFG = require("../config/default_config");

// 保存文件
const ListStreamedFileSavePath = pt.join(Utils.getResourcePath(), "cache", DefaultConfig.cacheStreamedFilesName);
const ListSoundBankSavePath = pt.join(Utils.getResourcePath(), "cache", DefaultConfig.cacheSoundBanksName);

/**
 *  生成缓存文件
 *  @returns {void}
 */
function cacheGenerator()
{
    const logger = new LoggerSaver();
    const gameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);
    const loader = new StreamedFilesJsonLoader(gameSoundBnkInfo);

    // 读取 SoundBnkInfo 文件信息
    let listStreamedFile = null, listSoundBank = null;

    // 加载条
    try
    {
        listStreamedFile = loader.loaderStreamedFiles();
        listSoundBank = loader.loaderSoundBanks();
        loader.clearCache();
    } catch (error)
    {
        logger.error("cacheGenerator =>", error.message || "error");
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
        logger
            .error("cacheGenerator =>", error.message || "error")
            .error("Cache Folder: ", pt.dirname(ListStreamedFileSavePath));

        return;
    }

    // 统计大小
    const originSize = Tools.formatBytes(fs.statSync(gameSoundBnkInfo).size);
    const cacheSize = Tools.formatBytes(Buffer.byteLength(d1, "binary") + Buffer.byteLength(d2, "binary"));

    // 统计输出
    logger
        .prompt("OriginSize:", originSize.value + originSize.type)
        .light("CacheSize:", cacheSize.value + cacheSize.type)
        .success("StreamedFiles:", loader.streamedFileCount)
        .success("SoundBanks:", loader.soundBankCount)
        .success("SoundBanks>StreamedFiles:", loader.soundBankStreamedFileCount)
        .light("Total:", loader.streamedFileCount + loader.soundBankStreamedFileCount);
}

/**
 *  清除缓存文件
 *  @returns {void}
 */
function clearCacheFile()
{
    const delSymbol = Tools.generateHashId(8) + ".temp";
    const logger = new LoggerSaver();
    const cachePath = pt.join(Utils.getResourcePath(), "cache");

    try
    {
        // 并不会删除
        if (fs.existsSync(ListStreamedFileSavePath))
        {
            const l1 = ListStreamedFileSavePath + "." + delSymbol;
            fs.renameSync(ListStreamedFileSavePath, l1);
        }

        if (fs.existsSync(ListSoundBankSavePath))
        {
            const l2 = ListSoundBankSavePath + "." + delSymbol;
            fs.renameSync(ListSoundBankSavePath, l2);
        }

        logger.success("Clear success");

    } catch (error)
    {
        logger
            .error("clearCacheFile =>", error.message || "error")
            .error("Cache Folder: ", cachePath);
    }
}

/**
 *  删除缓存文件
 *  @returns {void}
 */
async function deleteCacheFile()
{
    const cacheFolder = pt.join(Utils.getResourcePath(), "cache");
    const logger = new LoggerSaver();
    const listDelItem = [];

    try
    {
        const listDirent = fs.readdirSync(cacheFolder, { encoding: "utf-8", withFileTypes: true });
        for (let i = 0; i < listDirent.length; i++)
        {
            const dirent = listDirent[i];
            if (dirent.isFile() && pt.extname(dirent.name) === ".temp") listDelItem.push(pt.join(cacheFolder, dirent.name));
        }
    } catch (error)
    {
        logger
            .error("deleteCacheFile =>", error.message || "error")
            .error("Cache Folder: ", pt.dirname(ListStreamedFileSavePath));

        return;
    }

    // 空
    if (listDelItem.length < 1)
    {
        logger.info("Cache is empty");
        return;
    }

    // 列表
    logger.warn("是否要删除这些临时缓存文件");
    listDelItem.forEach(filePath => logger.info(filePath));
    logger.info("确定：[y]");

    const input = await Tools.terminalInput().catch(m => m = "");

    // 取消删除
    if (input != "y")
    {
        logger.warn("取消删除");
        return;
    }

    // 删除
    let su = 0;;
    for (let i = 0; i < listDelItem.length; i++)
    {
        const filePath = listDelItem[i];

        try
        {
            fs.rmSync(filePath);
            logger.success("Delete", i + 1, "=>", filePath);
            su++;
        } catch (error)
        {
            logger.error("Delete", error.message || "error");
        }
    }

    // 统计
    logger.light("Delete Total:", su);
}

module.exports = {
    cacheGenerator,
    clearCacheFile,
    deleteCacheFile
};

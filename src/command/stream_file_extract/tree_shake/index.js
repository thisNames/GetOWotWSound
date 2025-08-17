const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");
const FormatNumber = require("../../../class/FormatNumber");
const Loading = require("../../../class/Loading");
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
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function cacheGenerator(params, meta, __this, taskName)
{
    const logger = new LoggerSaver();
    const gameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);
    const loader = new StreamedFilesJsonLoader(gameSoundBnkInfo);
    const loading = new Loading();

    // 读取 SoundBnkInfo 文件信息
    let listStreamedFile = null, listSoundBank = null;

    // 加载条
    loading.start("cache...");
    try
    {
        listStreamedFile = loader.loaderStreamedFiles();
        listSoundBank = loader.loaderSoundBanks();
        loader.clearCache();
    } catch (error)
    {
        logger.error(`LoaderError: ${taskName} => ${error.message || "error"}`);
        loading.stop(false, "");
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

        // 成功
        loading.stop(true, "CacheSuccess");
    } catch (error)
    {
        logger.error(`WriteERROR: ${taskName} => ${error.message || "error"}`);
        loading.stop(false, "");
        return;
    }
    loading.stop(true, "");

    // 统计大小
    const fn = new FormatNumber();
    const originSize = fn.formatBytes(fs.statSync(gameSoundBnkInfo).size);
    const cacheSize = fn.formatBytes(Buffer.byteLength(d1, "binary") + Buffer.byteLength(d2, "binary"));

    // 统计输出
    logger
        .prompt("OriginSize:", originSize.value + originSize.type)
        .light("CacheSize:", cacheSize.value + cacheSize.type)
        .success("StreamedFiles:", loader.streamedFileCount)
        .success("SoundBanks:", loader.soundBankCount)
        .success("SoundBanks>StreamedFiles:", loader.soundBankStreamedFileCount)
        .light("Total:", loader.streamedFileCount + loader.soundBankStreamedFileCount)
        .info("StreamedFiles[cache]:", ListStreamedFileSavePath)
        .info("SoundBanks[cache]:", ListSoundBankSavePath);
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

        logger
            .success("Clear success")
            .info("Cache Folder =>", cachePath);

    } catch (error)
    {
        logger
            .error("Clear cache file =>", error.message || "error")
            .tip("Cache folder path =>", cachePath);
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
            .error("Try read cache folder =>", cacheFolder);
    }

    // 空
    if (listDelItem.length < 1)
    {
        logger.info("Delete cache folder is empty");
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

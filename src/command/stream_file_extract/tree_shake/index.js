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
    const delSymbol = Date.now() + "_" + Tools.generateHashId(8) + ".temp";
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
            .success("ClearCacheSuccess")
            .tip("Cache FolderPath =>", cachePath);

    } catch (error)
    {
        logger
            .error("ClearCacheFileError =>", error.message || "error")
            .tip("Cache FolderPath =>", cachePath);
    }
}

module.exports = {
    cacheGenerator,
    clearCacheFile
};

const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");
const Loading = require("../../../class/Loading");

const DefaultConfig = require("../class/DefaultConfig");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const PagePrinter = require("../class/PagePrinter");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");

const CFG = require("../config/default_config");
const OPT = require("../options/options");
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);

/**
 *  搜索
 *  @param {String} searchName 搜索名称
 *  @param {LoggerSaver} logger 日志记录器
 *  @returns {void}
 */
function search(searchName, logger)
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
        logger.tip("Search->StreamedFile");
        soundBnkInfoData = cacheLoaders.loaderStreamedFiles(DefaultConfig.cacheStreamedFilesName);
    }
    else if (OPT.searchEnum == 1)
    {
        // 搜索 SoundBank
        logger.tip("Search->SoundBank");
        soundBnkInfoData = cacheLoaders.loaderSoundBanks(DefaultConfig.cacheSoundBanksName);
    }
    else
    {
        // 搜索全部
        logger.tip("Search->All");
        soundBnkInfoData = cacheLoaders.loaders(DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName);
    }

    // 清除缓存
    cacheLoaders.clearCache();

    // 加载所有失败
    if (soundBnkInfoData instanceof Error)
    {
        logger.error("Search =>" + soundBnkInfoData.message || "error");
        loading.stop(false, "Error");
        return;
    }

    // 开始搜索
    let result = null;
    let short = null;

    const listStreamedFile = soundBnkInfoData.searchStreamedFile(searchName, OPT.enableIgnoreCase);
    const listSoundBank = soundBnkInfoData.searchSoundBank(searchName, OPT.enableIgnoreCase);

    result = listStreamedFile.length > listSoundBank.length ? listStreamedFile : listSoundBank;
    short = listStreamedFile.length < listSoundBank.length ? listStreamedFile : listSoundBank;

    if (short.length > 0) result.push(...short);

    // 空集合
    if (result.length < 1)
    {
        logger.info("什么也没用找到，试试别的吧~");
        loading.stop(false, "Empty");
        return;
    }

    // 成功
    loading.stop(true, `Total: ${result.length} Times:`);

    const pp = new PagePrinter(result, 2);

    pp.printer((item, i) =>
    {
        const title = `${i + 1}: [${item.Type}] #${item.Id}`;
        const content = "\t-> " + item.ShortName;

        logger
            .heighLight(title, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GREEN)
            .heighLight(content, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GRAY);
    });
}

/**
 *  搜索全部
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 *  @returns {void}
 */
function main(params, meta, __this, taskName)
{
    const logger = new LoggerSaver();
    const searchName = (params[0] + "").trim();

    // 检查搜索的名称不为空
    if (searchName === "")
    {
        logger.error(taskName + " 语法错误，必须有一个搜索名");
        return;
    }

    search(searchName, logger);
}

module.exports = main;
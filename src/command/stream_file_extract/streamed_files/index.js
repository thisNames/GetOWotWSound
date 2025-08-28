const pt = require("node:path");

const Logger = require("../../../class/Logger");
const Tools = require("../../../class/Tools");
const FormatNumber = require("../../../class/FormatNumber");

const DefaultConfig = require("../class/DefaultConfig");
const StreamedFilesWorker = require("../class/StreamedFilesWorker");
const Utils = require("../class/Utils");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const Ori = require("../class/Ori");
const SoundBanksInfoData = require("../class/SoundBanksInfoData");

const CFG = require("../config/default_config");
const OPT = require("../options/options");
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);

/**
 *  加载 StreamedFiles
 *  @returns {SoundBanksInfoData | Error}
 */
function loaderStreamedFiles()
{
    const customSFStruct = Utils.trim(OPT.customSFStruct);

    if (customSFStruct) return SoundBnkInfoCacheLoader.loaderCustomSFStruct(customSFStruct);

    const cacheLoaders = new SoundBnkInfoCacheLoader(GameSoundBnkInfo);
    return cacheLoaders.loaderStreamedFiles(DefaultConfig.cacheStreamedFilesName);
}

/**
 *  转换 wem
 *  @returns {void}
 */
async function converter()
{
    const sbInfoData = loaderStreamedFiles();
    const worker = new StreamedFilesWorker(CFG, OPT);
    const ori = new Ori();
    const fn = new FormatNumber();

    const prompts = ["y", "yes"];
    const filter = Utils.trim(OPT.filter);

    // 加载所有失败
    if (sbInfoData instanceof Error) return Logger.error(sbInfoData.message);

    // 使用过滤器
    const listStreamedFile = filter === "" ? sbInfoData.listStreamedFile : sbInfoData.searchStreamedFile(filter, OPT.enableSIgnoreCase);

    // 格式化输出配置
    Utils.formatOutputObject({
        operate: "StreamedFiles",
        total: listStreamedFile.length,
        ...OPT,
        executor: prompts.join("/")
    }).forEach(line => Logger.info(line.fKey, "=>", line.value));

    // 输出
    const input = await Tools.terminalInput().catch(m => m + "");
    if (!prompts.includes(input)) return Logger.warn("Cancel");

    // 开始执行
    const startTime = Date.now();
    const title = OPT.enableAsync ? "AsyncSF" : "SyncSF";

    ori.printer();
    Logger.info(title);

    try
    {
        // 初始化
        worker.init(title);
        worker.setPreTotal(listStreamedFile.length);

        // 执行
        OPT.enableAsync ? await worker.executor(listStreamedFile) : worker.executorSync(listStreamedFile);

        // 关闭
        worker.loggerEnd();
    } catch (error)
    {
        Logger.error(error.message);
    }

    // 格式换输出统计
    const time = fn.formatTimeMinute(Date.now() - startTime);
    Utils.formatOutputObject({
        ...worker.counter,
        bankExtractRate: worker.counter.SoundBankExtractRate(),
        wemConversionRate: worker.counter.StreamedFileConversionRate(),
        convertTime: time.value + time.type
    }).forEach(line => Logger.info(line.fKey, "=>", line.value));
}

module.exports = converter;

const pt = require("node:path");

const Logger = require("../../../class/Logger");
const Tools = require("../../../class/Tools");
const FormatNumber = require("../../../class/FormatNumber");

const DefaultConfig = require("../class/DefaultConfig");
const SoundBanksWorker = require("../class/SoundBanksWorker");
const Utils = require("../class/Utils");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const Ori = require("../class/Ori");

const CFG = require("../config/default_config");
const OPT = require("../options/options");
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);

/**
 *  提取 bnk
 *  @returns {void}
 */
async function extractor()
{
    const cacheLoaders = new SoundBnkInfoCacheLoader(GameSoundBnkInfo);
    const sbInfoData = cacheLoaders.loaderSoundBanks(DefaultConfig.cacheSoundBanksName);
    const worker = new SoundBanksWorker(CFG, OPT);
    const ori = new Ori();
    const fn = new FormatNumber();

    const prompts = ["y", "yes"];
    const filter = Utils.trim(OPT.filter);

    // 加载所有失败
    if (sbInfoData instanceof Error) return Logger.error(sbInfoData.message);

    // 使用过滤器
    const listSoundBank = filter === "" ? sbInfoData.listSoundBank : sbInfoData.filterSoundBank(filter, OPT.enableSIgnoreCase);

    // 格式化输出配置
    Utils.formatOutputObject({
        operate: "SoundBanks",
        total: sbInfoData.counterListSoundBank(listSoundBank),
        bnkTotal: listSoundBank.length,
        ...OPT,
        executor: prompts.join("/")
    }).forEach(line => Logger.info(line.fKey, "=>", line.value));

    // 输出
    const input = await Tools.terminalInput().catch(m => m + "");
    if (!prompts.includes(input)) return Logger.warn("Cancel");

    // 开始执行
    const startTime = Date.now();
    const title = OPT.enableAsync ? "AsyncSBK" : "SyncSBK";

    ori.printer();
    Logger.info(title);

    try
    {
        worker.init(title);

        // 执行
        if (OPT.enableAsync)
        {
            await worker.bnkExtractor(listSoundBank);
        }
        else
        {
            worker.bnkExtractorSync(listSoundBank);
        }
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

module.exports = extractor;

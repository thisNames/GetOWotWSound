const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Params = require("../../../class/Params");
const MainRunningMeta = require("../../../class/MainRunningMeta");
const Loading = require("../../../class/Loading");
const Tools = require("../../../class/Tools");

const DefaultConfig = require("../class/DefaultConfig");
const SoundBnkInfoCacheLoader = require("../class/SoundBnkInfoCacheLoader");
const StreamedFile = require("../class/StreamedFile");
const Utils = require("../class/Utils");

const CFG = require("../config/default_config");
const OPT = require("../options/options");
const GameSoundBnkInfo = pt.join(CFG.soundAssetsPath, DefaultConfig.soundBnkInfoName);

/**
 *  显示结果
 *  @param {Array<StreamedFile>} listStreamedFile streamedFiles 信息
 *  @param {String} searchName 搜索名称
 *  @returns {void}
 */
async function lister(listStreamedFile, searchName)
{
    const logger = new LoggerSaver();

    let currentPage = 0;
    let pageSize = Math.ceil(process.stdout.rows / 3);
    let totalPage = Math.ceil(listStreamedFile.length / pageSize);

    // 显示
    while (true)
    {
        let index = currentPage * pageSize;
        let endIndex = index + pageSize;

        for (let i = index; i < endIndex; i++)
        {
            if (i > listStreamedFile.length - 1) break;

            const item = listStreamedFile[i];
            const title = `${i + 1}: [${item.Type}] #${item.Id}`;
            const content = "\t-> " + item.ShortName;

            logger
                .heighLight(title, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GREEN)
                .heighLight(content, [searchName], LoggerSaver.LIGHT_YELLOW, LoggerSaver.GRAY);
        }

        logger.info(`w - 上一页，s - 下一页，tp n 跳转页，q - 退出，回车确认 ${currentPage + 1}/${totalPage} p${pageSize} ${listStreamedFile.length}`);
        const input = await Tools.terminalInput().catch(m => m + "");

        // 检测输入
        if (input == "w" && currentPage > 0)
        {
            currentPage--;
        }
        else if (input == "s" && currentPage < totalPage - 1)
        {
            currentPage++;
        }
        else if (input.startsWith("tp"))
        {
            let tpValue = Utils.instruction(input) - 1;
            currentPage = Math.min(totalPage - 1, Math.max(0, tpValue));
        }
        else if (input == "q" || input == "")
        {
            logger.light("退出");
            break;
        };
    }
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
    const loading = new Loading();

    // 检查搜索的名称不为空
    if (searchName === "")
    {
        logger.error(taskName + " 语法错误，必须有一个搜索名");
        return;
    }

    const cacheLoaders = new SoundBnkInfoCacheLoader(GameSoundBnkInfo);
    const soundBnkInfoData = cacheLoaders.loaders(DefaultConfig.cacheStreamedFilesName, DefaultConfig.cacheSoundBanksName);
    cacheLoaders.clearCache();

    // 加载所有失败
    if (soundBnkInfoData instanceof Error)
    {
        logger.error(soundBnkInfoData.message);
        return;
    }

    loading.start("searching...");

    // 搜索 StreamedFiles 以及 SoundBanks 的名称
    const listSearchSoundBanks = soundBnkInfoData.searchSoundBank(searchName, OPT.enIgnoreCase);
    const listSearchStreamedFile = soundBnkInfoData.searchStreamedFile(searchName, OPT.enIgnoreCase);

    if (listSearchStreamedFile.length > 0) listSearchSoundBanks.push(...listSearchStreamedFile);

    // 空
    if (listSearchSoundBanks.length < 1)
    {
        logger.info("什么也没用找到，试试别的吧~");
        loading.stop(false, "Empty");
        return;
    }

    // 成功
    loading.stop(true, `Total: ${listSearchSoundBanks.length} Times:`);

    lister(listSearchSoundBanks, searchName);
}

module.exports = main;
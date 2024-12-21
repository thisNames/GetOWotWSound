const namespace = require("../class");

const bnkBuildTaskSync = require("../index_bnk");

/**
 * 同步执行
 * @param {namespace.RunOption} option
 * @description 开始执行：bnk -->  wem --> ogg
 * @version v2.0.0
 */
function buildSyncAndTask(option)
{
    const { SoundBanksInfo } = namespace.SoundbanksInfoJson;

    const running = new namespace.RunningLog("bnk_to_wem_to_ogg_sync", namespace.config.logPath);

    // bnk 文件总数
    const bnkTotal = SoundBanksInfo.SoundBanks.length;

    // wem 文件总数

    let wemTotal = 0;
    // wem to ogg 成功的
    let wemToOggSuccess = 0;

    // log
    const bnkTotalMsg = `bnk build with ${bnkTotal}; executer ${option.executer}`;
    running.runSave(bnkTotalMsg).printRow(bnkTotalMsg);

    // 组装数据
    const taskList = SoundBanksInfo.SoundBanks.map((soundBank, index) => new namespace.BnkSendData(bnkTotal, soundBank, index, option.executer));

    // 控制长度
    const length = Math.min(taskList.length, option.task === "ori" ? taskList.length : option.task);

    // 开始执行任务
    for (let i = 0; i < length; i++)
    {
        const task = taskList[i];
        const result = bnkBuildTaskSync(task);

        wemTotal += result.wemTotal;
        wemToOggSuccess += result.wemToOggSuccess;

        // 全局统计
        const o = `global current wem count: ${wemTotal}; wem to ogg success: ${wemToOggSuccess}`;
        running.runSave(o).printRow(o);
    }

    running.runSave(running.printLine());

    // 完成率 wem to ogg
    const w2o = (wemToOggSuccess / wemTotal * 100).toFixed() + "%";
    const wemTotalMsg = "global wem total: ".concat(wemTotal);
    const wemToOggSuccessMsg = "global wem to ogg success: ".concat(wemToOggSuccess);
    const w2oMsg = "global crate: ".concat(w2o);

    running.runSave(wemTotalMsg).printRow(wemTotalMsg);
    running.runSave(wemToOggSuccessMsg).printRow(wemToOggSuccessMsg);
    running.runSave(w2oMsg).printRow(w2oMsg);

    running.runSave(running.printLine());

    running.closeFiles();
}

module.exports = buildSyncAndTask;
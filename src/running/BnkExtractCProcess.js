const namespace = require("../class");

/**
 * 同步执行，多进程（同步、异步）
 * @param {namespace.ChildProcessRunOption} option
 * @description 开始执行：bnk -->  wem --> ogg
 * @version v2.0.0
 */
function buildProcess(option)
{
    // json
    const { SoundBanksInfo } = namespace.SoundbanksInfoJson;

    // 初始化
    const running = new namespace.RunningLog("bnk_to_wem_to_ogg_process", namespace.config.logPath);
    const ps = new namespace.ProcessSet(option.cMax, option.taskScript);

    // bnk 文件总数
    const bnkTotal = SoundBanksInfo.SoundBanks.length;

    // wem 文件总数
    let wemTotal = 0;

    // wem to ogg 成功的
    let wemToOggSuccess = 0;

    // log
    const bnkTotalMsg = `build bnk with ${bnkTotal}; executer ${option.executer}; isAsync ${option.isAsync}`;
    running.runSave(bnkTotalMsg).printRow(bnkTotalMsg);

    // 启动子进程
    ps.initProcess(function (pid)
    {
        const cpMsg = `child process ${pid} init`;
        running.runSave(cpMsg).printRow(cpMsg);
    });

    // 组装数据
    ps.taskList = SoundBanksInfo.SoundBanks.map((soundBank, index) => new namespace.BnkSendData(bnkTotal, soundBank, index, option.executer));

    const callbacks = {
        next(index, pid)
        {
            const taskMsg = `current task is ${index} child process ${pid}`;
            running.runSave(taskMsg).printRow(taskMsg);
            return option.task === "ori" ? true : --option.task > 0;
        },
        complete(_value)
        {
            /** @type {namespace.BnkAcceptData} */
            const value = _value;
            wemTotal += value.wemTotal;
            wemToOggSuccess += value.wemToOggSuccess;

            // 全局统计
            const o = `global current wem count: ${wemTotal}; wem to ogg success: ${wemToOggSuccess}`;
            running.runSave(o).printRow(o);
        }
    }

    // 同步 61074ms
    // 异步 50565ms
    ps.running(callbacks, option.isAsync).then(count =>
    {
        // 统计数据
        // 执行的数量
        const countMsg = `process executer task count: ${count}`;
        running.runSave(countMsg).printRow(countMsg);

        running.runSave(running.printLine());

        // 子进程 kill
        const cps = ps.kills();

        cps.forEach(cp =>
        {
            const killMsg = `kill child process ${cp.pid} done=${cp.done}`
            running.runSave(killMsg).printRow(killMsg);
        });

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
    });
}

module.exports = buildProcess;
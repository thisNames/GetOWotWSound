/**
 *  执行 wem to ogg 执行函数
 */
const namespace = require("./class");

/**
 * 运行结束
 * @param {namespace.BnkAcceptData} BnkAcceptData
 * @returns {namespace.BnkAcceptData}
 */
function runClose(BnkAcceptData)
{
    // 子进程使用
    process.send && process.send(BnkAcceptData);

    // 模块化使用（单进程）
    return BnkAcceptData;
}

/**
 * 运行任务 
 * @param {namespaceBnkSendData} BnkSendData
 * @returns {namespace.BnkAcceptData}
 */
function bnkBuildTaskSync(BnkSendData)
{
    // wem 文件总数
    let wemTotal = 0;

    // wem to ogg 成功的
    let wemToOggSuccess = 0;

    // 组装数据 --------

    // 获取一个 SoundBank
    const ss = BnkSendData.SoundBank;

    // 当前的 SoundBank 节点的名称
    const ShortName = ss.ShortName;

    // SoundBank 里面的 File 对象数组
    const IncludedMemoryFiles = [];

    // 运行日志类
    const running = new namespace.RunningLog(ShortName, namespace.config.logPath);

    // 进度 123/001
    const bnkCurrentNumberStr = (BnkSendData.index + 1).toFixed().padStart(BnkSendData.bnkTotalLength, "0");
    const bnkCurrentNumber = `${BnkSendData.bnkTotal}/${bnkCurrentNumberStr}`;

    // 空节点 拜拜
    if (ss.IncludedMemoryFiles === undefined || !Array.isArray(ss.IncludedMemoryFiles))
    {
        const nullNodeMsg = `${bnkCurrentNumber} build: ${ShortName} is not <IncludedMemoryFiles> node`;
        running.runSave(nullNodeMsg).printRow(nullNodeMsg);
        return runClose(new namespace.BnkAcceptData(0, 0));
    }

    // debug delete
    // if (ShortName === "persistent")
    // {
    //     return runClose(new namespace.BnkAcceptData(0, 0));
    // }

    // 填充数组
    ss.IncludedMemoryFiles.forEach(mf => IncludedMemoryFiles.push(new namespace.AudioItem(mf.Id, mf.Language, mf.ShortName, mf.Path)));

    // 创建一个 SoundBank 实例
    const soundBank = new namespace.SoundBank(ss.Id, ss.Language, ss.ShortName, ss.Path, ss.GUID, ss.ObjectPath, IncludedMemoryFiles);

    // 开始处理一个 SoundBank
    const imf = new namespace.IncludedMemoryFile(namespace.config, soundBank);
    imf.setTools(namespace.ww2ogg, namespace.revorb, namespace.bnk2wm);

    // data collect
    // SoundBank 里面的 File 的数量
    const fileTotal = imf.SoundBank.IncludedMemoryFiles.length;
    const fileTotalLength = imf.SoundBank.IncludedMemoryFiles.length.toFixed().length;

    // 当前的执行
    let oggCurrent = 0;
    let fixCurrent = 0;

    // 解压 bnk（同步）
    const wem = imf.buildBnkToWemSync();

    // ++wem
    wemTotal = wem.wemFilePathList.length;

    // log
    const startBuildBeforeMsg = `build [${ShortName}] in ${bnkCurrentNumber} total with ${fileTotal}`;
    running.runSave(running.printLine());
    running.runSave(startBuildBeforeMsg).printRow(startBuildBeforeMsg);

    // 生成 ogg（同步）
    imf.buildSync(wem.wemFilePathList, function (value)
    {
        oggCurrent++;
        const currentStr = oggCurrent.toFixed().padStart(fileTotalLength, "0");
        const line = `${bnkCurrentNumber} build: [${imf.SoundBank.ShortName}] in ${fileTotal}/${currentStr} to ${value.target} done=${value.done}`;
        // log
        running.logTask(value.done, line, value);
        running.printRow(line);
        value.done && wemToOggSuccess++;
        return BnkSendData.executer === "ori" ? true : --BnkSendData.executer > 0;
    });

    // log
    const starFixBeforeMsg = `fixed [${ShortName}] in ${bnkCurrentNumber} total with ${fileTotal}`;
    running.runSave(running.printLine());
    running.runSave(starFixBeforeMsg).printRow(starFixBeforeMsg);

    // 修复 ogg（同步）
    imf.fixOriOggSync(function (value)
    {
        fixCurrent++;
        const fixCurrentStr = fixCurrent.toFixed().padStart(fileTotalLength, "0");
        const line = `${bnkCurrentNumber} fixed: [${imf.SoundBank.ShortName}] in ${fileTotal}/${fixCurrentStr} to ${value.target} done=${value.done}`;

        // log
        running.logTask(value.done, line, value);
        running.printRow(line);

        return true;
    });

    // 统计
    running.runSave(running.printLine());

    // 完成一个 SoundBank 处理
    const endMsg = "".concat("[", imf.SoundBank.ShortName, "]");
    running.runSave(endMsg).printRow(endMsg);

    // 总数
    const fileTotalMsg = "".concat("\t", "total:\t\t" + fileTotal);
    running.runSave(fileTotalMsg).printRow(fileTotalMsg);

    // 成功的
    const success = imf.buildSyncScAudioItems.length;
    const successMsg = "".concat("\t", "success:\t" + success);
    running.runSave(successMsg).printRow(successMsg);

    // 失败的
    const failing = imf.buildSyncFaAudioItems.length;
    const failingMsg = "".concat("\t", "failing:\t" + failing);
    running.runSave(failingMsg).printRow(failingMsg);

    // 完成率
    const cr = (success / fileTotal * 100).toFixed() + "%";
    const crMsg = "".concat("\t", "crate:\t\t" + cr);
    running.runSave(crMsg).printRow(crMsg);

    running.runSave(running.printLine());

    // // 完成率 wem to ogg
    // const w2o = (wemToOggSuccess / wemTotal * 100).toFixed() + "%";
    // const w2oMsg = "crate: ".concat(w2o);
    // const wemTotalMsg = "wem total: ".concat(wemTotal);
    // const wemToOggSuccessMsg = "wem to ogg success: ".concat(wemToOggSuccess);

    // running.runSave(wemTotalMsg).printRow(wemTotalMsg);
    // running.runSave(wemToOggSuccessMsg).printRow(wemToOggSuccessMsg);
    // running.runSave(w2oMsg).printRow(w2oMsg);

    // running.runSave(running.printLine());

    running.closeFiles();

    return runClose(new namespace.BnkAcceptData(wemTotal, wemToOggSuccess));
}

// 子进程使用
process.on("message", bnkBuildTaskSync);

// 模块化使用（单进程）
module.exports = bnkBuildTaskSync;

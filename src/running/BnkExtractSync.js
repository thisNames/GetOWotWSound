/**
 *  bnk 提取 
 *  1. 解压 bnl 文件保存至目录 wem 文件
 *  2. wem 转换 ogg
 *  3. fix ogg 文件
 */

const namespace = require("../class");

/**
 * 同步
 * @param {namespace.RunOption} option
 * @deprecated 请使用 BnkExtractSyncTask.js
 * @description 开始执行：bnk -->  wem --> ogg
 * @version v1.0.0
 */
function buildSync(option)
{
    const { SoundBanksInfo } = namespace.SoundbanksInfoJson;

    // wem 文件总数
    let wemTotal = 0;

    // wem to ogg 成功的
    let wemToOggSuccess = 0;

    // bnk 文件总数
    const bnkTotal = SoundBanksInfo.SoundBanks.length;

    // bnk 字符串长度
    const bnkTotalLength = bnkTotal.toFixed().length;

    // 控制长度
    const originExecuter = option.executer;
    const length = Math.min(bnkTotal, option.task === "ori" ? bnkTotal : option.task);

    for (let i = 0; i < length; i++)
    {
        option.executer = originExecuter;
        // 组装数据

        // 获取一个 SoundBank
        const ss = SoundBanksInfo.SoundBanks[i];

        // 当前的 SoundBank 节点的名称
        const ShortName = ss.ShortName;

        // SoundBank 里面的 File 对象数组
        const IncludedMemoryFiles = [];

        // 运行日志类
        const running = new namespace.RunningLog(ShortName, namespace.config.logPath);

        // 进度 123/001
        const bnkCurrentNumberStr = (i + 1).toFixed().padStart(bnkTotalLength, "0");
        const bnkCurrentNumber = `${bnkTotal}/${bnkCurrentNumberStr}`;

        // 空节点 拜拜
        if (ss.IncludedMemoryFiles === undefined || !Array.isArray(ss.IncludedMemoryFiles))
        {
            const nullNodeMsg = `${bnkCurrentNumber} build: ${ShortName} is not <IncludedMemoryFiles> node`;
            running.runSave(nullNodeMsg).printRow(nullNodeMsg);
            continue;
        }

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
        wemTotal += wem.wemFilePathList.length;

        // log
        const startBuildBeforeMsg = `build [${ShortName}] in ${bnkCurrentNumber} total with ${fileTotal} wem is ${wemTotal}; executer ${option.executer}`;
        running.runSave(startBuildBeforeMsg).printRow(startBuildBeforeMsg);
        running.runSave(running.printLine());

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
            return option.executer === "ori" ? true : --option.executer > 0;
        });

        // log
        const starFixBeforeMsg = `fixed [${ShortName}] in ${bnkCurrentNumber} total with ${fileTotal}`;
        running.runSave(starFixBeforeMsg).printRow(starFixBeforeMsg);
        running.runSave(running.printLine());

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

        // 完成率 wem to ogg
        const w2o = (wemToOggSuccess / wemTotal * 100).toFixed() + "%";
        const w2oMsg = "crate: ".concat(w2o);
        const wemTotalMsg = "wem total: ".concat(wemTotal);
        const wemToOggSuccessMsg = "wem to ogg success: ".concat(wemToOggSuccess);

        running.runSave(wemTotalMsg).printRow(wemTotalMsg);
        running.runSave(wemToOggSuccessMsg).printRow(wemToOggSuccessMsg);
        running.runSave(w2oMsg).printRow(w2oMsg);

        running.runSave(running.printLine());

        running.closeFiles();
    }
}

module.exports = buildSync;
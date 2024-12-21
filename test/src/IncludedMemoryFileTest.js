/** 测试 IncludedMemoryFile 类 */
const namespace = require("../../src/class");

const config = new namespace.Config("config", "config.properties");
const ww2ogg = new namespace.Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
const revorb = new namespace.Revorb(config.revorb);
const bnk2wm = new namespace.Bnkextr(config.bnk2wem);

// 注意：require 函数走的是相对路径 __filename

function testBnkToWem()
{
    const length = SoundBanksInfo.SoundBanks.length;
    for (let i = 0; i < SoundBanksInfo.SoundBanks.length; i++)
    {
        let bnkCurrentNumber = `${length}/${i + 1}`;

        // 组装数据
        const ss = SoundBanksInfo.SoundBanks[i];
        const IncludedMemoryFiles = [];

        if (ss.IncludedMemoryFiles === undefined)
        {
            const line = `${bnkCurrentNumber} build: ${ss.ShortName} is not <IncludedMemoryFiles> node`;
            console.debug(line);
            continue;
        }

        ss.IncludedMemoryFiles.forEach(mf => IncludedMemoryFiles.push(new namespace.AudioItem(mf.Id, mf.Language, mf.ShortName, mf.Path)));
        const soundBank = new namespace.SoundBank(ss.Id, ss.Language, ss.ShortName, ss.Path, ss.GUID, ss.ObjectPath, IncludedMemoryFiles);

        // console.log(soundBank.Id, soundBank.GUID, soundBank.Language, soundBank.ObjectPath, soundBank.ShortName, soundBank.Path);
        // console.log(soundBank.IncludedMemoryFiles.length);

        // 处理一个 SoundBank
        const imf = new namespace.IncludedMemoryFile(config, soundBank);
        imf.setTools(ww2ogg, revorb, bnk2wm);

        // 同步（30679ms）
        // const complete = imf.buildBnkToWemSync();

        // 异步（29766ms）
        // imf.buildBnkToWem().then(complete =>
        // {
        //     const line = `${bnkCurrentNumber} build: ${ss.ShortName} ${complete.complete.target} ${complete.complete.done}`;
        //     console.debug(line);
        // });
    }
}
// testBnkToWem();

function testBuildSync(test)
{
    // bnk 文件总数
    const bnkTotal = SoundBanksInfo.SoundBanks.length;

    // bnk 字符串长度
    const bnkTotalLength = bnkTotal.toFixed().length;

    for (let i = 0; i < bnkTotal; i++)
    {
        if (i >= test) break;

        // 组装数据

        // 获取一个 SoundBank
        const ss = SoundBanksInfo.SoundBanks[i];

        // 当前的 SoundBank 节点的名称
        const ShortName = ss.ShortName;

        // SoundBank 里面的 File 对象数组
        const IncludedMemoryFiles = [];

        // 运行日志类
        const running = new namespace.RunningLog(ShortName, config.logPath);

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

        // persistent.bnk 2000 多个，测试不力了
        if (ShortName === "persistent")
        {
            console.log("persistent continue");
            continue;
        }

        // 填充数组
        ss.IncludedMemoryFiles.forEach(mf => IncludedMemoryFiles.push(new namespace.AudioItem(mf.Id, mf.Language, mf.ShortName, mf.Path)));

        // 创建一个 SoundBank 实例
        const soundBank = new namespace.SoundBank(ss.Id, ss.Language, ss.ShortName, ss.Path, ss.GUID, ss.ObjectPath, IncludedMemoryFiles);

        // console.log(soundBank.Id, soundBank.GUID, soundBank.Language, soundBank.ObjectPath, soundBank.ShortName, soundBank.Path);
        // console.log(soundBank.IncludedMemoryFiles.length);

        // 开始处理一个 SoundBank
        const imf = new namespace.IncludedMemoryFile(config, soundBank);
        imf.setTools(ww2ogg, revorb, bnk2wm);

        // data collect
        // SoundBank 里面的 File 的数量
        const fileTotal = imf.SoundBank.IncludedMemoryFiles.length;
        const fileTotalLength = imf.SoundBank.IncludedMemoryFiles.length.toFixed().length;

        // 当前的执行
        let oggCurrent = 0;
        let fixCurrent = 0;

        // 解压 bnk（同步）
        const wem = imf.buildBnkToWemSync();

        // log
        const startBuildBeforeMsg = `build [${ShortName}] in ${bnkCurrentNumber} total with ${fileTotal}`;
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

            // 5821ms exit
            // imf.fixOggSync(value.target, function (f)
            // {
            //     const line = `${bnkCurrentNumber} fixed: [${imf.SoundBank.ShortName}] in ${imfTotal}/${buildCurrentStr} to ${value.target} done=${f.done}`;
            //     console.debug(line);
            // });

            return true;
        });


        // log
        const starFixBeforeMsg = `fixed [${ShortName}] in ${bnkCurrentNumber} total with ${fileTotal}`;
        running.runSave(starFixBeforeMsg).printRow(starFixBeforeMsg);
        running.runSave(running.printLine());

        // 修复 ogg（同步）
        // 5700ms exit
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

        running.closeFiles();
    }
}

// 多进程测试
function testBuildProcess(test)
{
    const { SoundBanksInfo } = namespace.SoundbanksInfoJson;

    const running = new namespace.RunningLog("wem_process_log", namespace.config.logPath);
    const ps = new namespace.ProcessSet(3, "../src/BnkTask.js");

    // bnk 文件总数
    const bnkTotal = SoundBanksInfo.SoundBanks.length;

    // wem 文件总数
    let wemTotal = 0;

    // wem to ogg 成功的
    let wemToOggSuccess = 0;

    // log
    const bnkTotalMsg = `bnk with ${bnkTotal}`;
    running.runSave(bnkTotalMsg).printRow(bnkTotalMsg);

    // 启动子进程
    ps.initProcess(function (pid)
    {
        const cpMsg = `cp ${pid} init`;
        running.runSave(cpMsg).printRow(cpMsg);
    });

    // 组装任务数据
    ps.taskList = SoundBanksInfo.SoundBanks.map((soundBank, index) => new namespace.BnkSendData(bnkTotal, soundBank, index));

    const callbacks = {
        next(value)
        {
            const taskMsg = `current task is ${value}`;
            running.runSave(taskMsg).printRow(taskMsg);
            return --test > 0;
        },
        complete(_value)
        {
            /** @type {namespace.BnkAcceptData} */
            const value = _value;
            wemTotal += value.wemTotal;
            wemToOggSuccess += value.wemToOggSuccess;

            const o = `current wem count: ${wemTotal}; wem to ogg success: ${wemToOggSuccess}`;
            running.runSave(o).printRow(o);

        }
    }

    // 同步 61074ms
    // 异步 50565ms
    ps.running(callbacks, false).then(count =>
    {
        // 统计数据

        // 执行的数量
        const countMsg = `count: ${count}`;
        running.runSave(countMsg).printRow(countMsg);

        running.runSave(running.printLine());
        // 子进程 kill
        const killSMsg = `kills: ${ps.kills().toString()}`;
        running.runSave(killSMsg).printRow(killSMsg);

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
    });
}

/**
 *  同步（在没有关闭 debug 的清空下）
 *  处理一个 bnk，105 wem 文件。                用时：5721ms exit
 *  处理所有的 bnk （123 - 3），>1w 个 wem      用时：856849ms exit
 */
// testBuildSync(1); // 211023ms
// testBuildSync(125); // 1027960ms exit

// testBuild(124); // 28463ms exit

testBuildProcess(10);

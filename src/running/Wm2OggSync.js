/**
 * wem to ogg 同步
 */
const namespace = require("../class");

/**
 * 执行（单线程，同步）
 * @param {namespace.RunOption} option
 * @description 开始执行：wem -> ogg
 * @version v1.0.0
 */
function wem2oggSync(option)
{
    // -------------------------- wem to ogg -------------------------------
    // 实例对象
    const rs = new namespace.ReferencedStreamedFile(namespace.config, namespace.SoundbanksInfoJson.SoundBanksInfo.StreamedFiles);
    rs.setTools(namespace.ww2ogg, namespace.revorb, namespace.bnk2wm);

    // 运行日志类
    const running = new namespace.RunningLog("wem_to_ogg_sync", namespace.config.logPath);

    // ogg 成功数
    let oggSuccess = 0;
    let oggFailing = 0;

    // fix 成功数
    let fixSuccess = 0;
    let fixFailing = 0;

    // 当前的执行
    let oggCurrent = 0;
    let fixCurrent = 0;

    // wem 文件总数
    const total = rs.nodes.length;
    // 字符串长度
    const length = total.toFixed().length;

    // 开始运行
    const buildMsg = `build total with ${total}; executer ${option.executer}`
    running.runSave(buildMsg).printRow(buildMsg);

    // 解析 wem to ogg（同步）
    rs.buildSync(function (value)
    {
        oggCurrent++;
        const currentStr = oggCurrent.toFixed().padStart(length, "0");
        const line = `build ${total}/${currentStr}: ${value.target} ${value.done}`;

        value.done ? oggSuccess++ : oggFailing++;

        // log
        running.logTask(value.done, line, value);
        running.printRow(line);

        return option.executer === "ori" ? true : (--option.executer > 0);
    });

    const fixMsg = `fixing total with ${total}`;
    running.runSave(fixMsg).printRow(fixMsg);

    // 同步 fix 377570ms exit
    rs.fixOriOggSync(function (value)
    {
        fixCurrent++;
        const currentStr = fixCurrent.toFixed().padStart(length, "0");
        const line = `fixed ${total}/${currentStr}: ${value.target} ${value.done}`;

        value.done ? fixSuccess++ : fixFailing++;

        // log
        running.logTask(value.done, line, value);
        running.printRow(line);

        return true;
    });

    running.runSave(running.printLine());

    // 总数
    const totalMsg = "".concat("total: " + total);
    running.runSave(totalMsg).printRow(totalMsg);

    // ogg
    const oggSuccessMsg = "".concat("oggSuccess: " + oggSuccess);
    const oggFailingMsg = "".concat("oggFailing: " + oggFailing);
    running.runSave(oggSuccessMsg).printRow(oggSuccessMsg);
    running.runSave(oggFailingMsg).printRow(oggFailingMsg);

    // fix
    const fixSuccessMsg = "".concat("fixSuccess: " + fixSuccess);
    const fixFailingMsg = "".concat("fixFailing: " + fixFailing);
    running.runSave(fixSuccessMsg).printRow(fixSuccessMsg);
    running.runSave(fixFailingMsg).printRow(fixFailingMsg);

    // 完成率
    const oggCr = (oggSuccess / total * 100).toFixed(2) + "%";
    const fixCr = (fixSuccess / total * 100).toFixed(2) + "%";

    const oggCrateMsg = "".concat("oggCrate: " + oggCr);
    const fixCrateMsg = "".concat("fixCrate: " + fixCr);

    running.runSave(oggCrateMsg).printRow(oggCrateMsg);
    running.runSave(fixCrateMsg).printRow(fixCrateMsg);

    running.closeFiles();
}

module.exports = wem2oggSync;
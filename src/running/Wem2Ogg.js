/**
 * wem to ogg 异步
 */
const namespace = require("../class");

async function wem2oggAndPromise(cMax = 20)
{
    // -------------------------- wem to ogg -------------------------------
    // 实例对象
    const rs = new namespace.ReferencedStreamedFile(namespace.config, namespace.SoundbanksInfoJson.SoundBanksInfo.StreamedFiles);
    rs.setTools(namespace.ww2ogg, namespace.revorb, namespace.bnk2wm);

    // 运行日志类
    const running = new namespace.RunningLog("wem_to_ogg", namespace.config.logPath);

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
    const buildMsg = `building total with ${total} cMax ${cMax}`;
    running.runSave(buildMsg).printRow(buildMsg);

    // 解析 wem to ogg（异步）
    await rs.buildAndPromise(cMax, {
        next(value)
        {
            return true;
        },
        taskList(tasks)
        {
            // 拿到一个并发的结果（cMax个）
            for (let i = 0; i < tasks.length; i++)
            {
                oggCurrent++;
                const task = tasks[i];
                const currentStr = oggCurrent.toFixed().padStart(length, "0");
                const line = `build ${total}/${currentStr}: ${task.target} ${task.done}`;

                // log
                running.logTask(task.done, line, task);
                running.printRow(line);
                task.done ? oggSuccess++ : oggFailing++;

                rs.fixOggSync(task.target, function (f)
                {
                    fixCurrent++;
                    const currentStr = fixCurrent.toFixed().padStart(length, "0");
                    const line = `fixed ${total}/${currentStr}: ${task.target} ${f.done}`;

                    // log
                    running.logTask(f.done, line, { ...f, target: task.value, source: task.source });
                    running.printRow(line);

                    f.done ? fixSuccess++ : fixFailing++;
                });
            }
        }
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
    const fixCrateMsg = "".concat("FixCrate: " + fixCr);

    running.runSave(oggCrateMsg).printRow(oggCrateMsg);
    running.runSave(fixCrateMsg).printRow(fixCrateMsg);

    running.closeFiles();
}

module.exports = wem2oggAndPromise;
/** 测试 ReferencedStreamedFile 类 */

const namespace = require("../../src/class");

const config = new namespace.Config("config", "config.properties");
const ww2ogg = new namespace.Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
const revorb = new namespace.Revorb(config.revorb);
const bnk2wm = new namespace.Bnkextr(config.bnk2wem);

// 注意：require 函数走的是相对路径
const soundbanksInfo = require("../SoundbanksInfo.json");

// -------------------------- wem to ogg -------------------------------
// 实例对象
const rs = new namespace.ReferencedStreamedFile(config, soundbanksInfo.SoundBanksInfo.StreamedFiles);
rs.setTools(ww2ogg, revorb, bnk2wm);

// 同步测试 + 异步 use
function testBuildSync(test = 10)
{
    // 运行日志类
    const running = new namespace.RunningLog("wem_to_ogg", config.logPath);

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
    const length = total.length;

    const buildMsg = `building total with ${total}`
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

        return --test > 0;
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
    const fixCrateMsg = "".concat("FixCrate: " + fixCr);

    running.runSave(oggCrateMsg).printRow(oggCrateMsg);
    running.runSave(fixCrateMsg).printRow(fixCrateMsg);

    running.closeFiles();

    // 异步fix 360118ms exit
    // rs.fixOriOggAndPromise(5, {
    //     next(value)
    //     {
    //         return true;
    //     },
    //     taskList(tasks)
    //     {
    //         tasks.forEach(task =>
    //         {
    //             fixCurrent++;
    //             const currentStr = fixCurrent.toFixed().padStart(length, "0");
    //             const line = `fix ${total}/${currentStr}: \t${task.target} ${task.done}`;
    //             console.debug(line);
    //         });
    //     }
    // }).then(count =>
    // {
    //     console.debug(`fix complete ${count}`);
    // });
}
// testBuildSync(3000); // 476157ms
// 100 -> 13413ms

// 异步测试
/**
 * @deprecated
 */
function testBuild()
{
    let current = 0;
    let fixCurrent = 0;
    const total = rs.nodes.length;
    const length = rs.nodes.length.toFixed().length;
    rs.build({
        next(value)
        {
            current++;
            const currentStr = current.toFixed().padStart(length, "0");
            const line = `task ${total}/${currentStr}: ${value.target}`;
            console.debug(line);
            return true;
        },
        task(value)
        {
            rs.fixOgg(value.target, function (f)
            {
                fixCurrent++;
                const currentStr = fixCurrent.toFixed().padStart(length, "0");
                const line = `fix ${total}/${currentStr}: \t${value.target} ${f.done}`;
                console.debug(line);
            });
        },
        complete(value)
        {
            console.debug(`build ogg ${value}`);
        }
    });
}
// testBuild(); // 275492 ms

// 异步 + 同步 use
async function testBuildAndPromise(test)
{
    // 运行日志类
    const running = new namespace.RunningLog("wem_to_ogg", config.logPath);

    // 最大并发数
    const cMax = 20;

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
    const length = total.length;

    // 开始运行
    const buildMsg = `building total with ${total} cMax ${cMax}`;
    running.runSave(buildMsg).printRow(buildMsg);

    // 解析 wem to ogg（异步）
    await rs.buildAndPromise(cMax, {
        next(value)
        {
            return --test > 0;
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

                // 同步 303411ms / 20 cMax 232473ms
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
                // 异步 5 cMax 275209ms / 20 cMax 232473ms
                // rs.fixOgg(task.target).then(f =>
                // {
                //     fixCurrent++;
                //     const currentStr = fixCurrent.toFixed().padStart(length, "0");
                //     const line = `fixed ${total}/${currentStr}: ${task.target} ${f.done}`;
                //     console.debug(line);
                // });
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

testBuildAndPromise(3000); // 287082ms
// 100 -> 11788ms exit

// --------------------------- fix ogg one ------------------------------
const oggPath = "test.ogg";
// 同步测试
function testFixOggSync()
{
    const st = Date.now();

    rs.fixOggSync(oggPath, function (value)
    {
        console.log(oggPath, value.done);
    });

    const ut = Date.now() - st;
    console.log("fixOggSync: " + ut + "ms");
}
// testFixOggSync(); // 24ms

// 异步测试（测试一个使用异步没有明显效果）
function testFixOgg()
{
    const st = Date.now();

    rs.fixOgg(oggPath, function (value)
    {
        console.log(oggPath, value.done);
    });

    const ut = Date.now() - st;
    console.log("fixOgg: " + ut + "ms");
}
// testFixOgg(); // 22ms

// ---------------------------fix ogg ori ------------------------------

// 同步测试
function testFixOriOggSync()
{
    // 生成 成功的 ogg 文件
    testBuildSync();

    const st = Date.now();
    rs.fixOriOggSync(function (value)
    {
        console.log(value.target, value.done);
        return true;
    });

    const ut = Date.now() - st;
    console.log("fixOriOggSync: " + ut + "ms");
}
// testFixOriOggSync(); // 149ms

// 异步测试
function testFixOriOgg()
{
    // 生成 成功的 ogg 文件
    testBuildSync();

    const st = Date.now();

    rs.fixOriOgg({
        next()
        {
            return true;
        },
        task(value)
        {
            console.log(value.target, value.done);
        },
        complete(value)
        {
            const ut = Date.now() - st;
            console.log(`fixOriOgg ${value}: ` + ut + "ms");
        }
    });
}
// testFixOriOgg(); // 59ms

/**
 *  入口文件
*/
const st = Date.now();

const pt = require("node:path");

process.on("exit", () =>
{
    console.log("-".repeat(30));
    console.log("[".concat(Date.now() - st, "ms exit]"))
});

const namespace = require("./class");
const run = require("./running");

let help = `commands:
    wem executer <n/ori>                # 获取音频资源 .wem（同步）
    wem executer <n/ori> async <n>      # 获取音频资源 .wem（异步、同步并发）
    wem list                            # 获取 wem 文件的数量
    bnk executer <n/ori> task <n/ori>                            # 获取音效资源 .bnk（单进程、同步）
    bnk executer <n/ori> task <n/ori> cps <n> async <true/false> # 获取音效资源 .bnk（多进程、同步、异步）beta
    bnk list                                                     # 获取 bnk 文件的数量
    ori     # 打印一个 ori
    help    # 帮助
    list    # 获取 wem 文件、bnk 文件的数量（以 SoundBanksInfo 文件中定义的为准）
options:
    executer <n/ori>        # 解析获取 wem 文件的数量 n 或者 ori（all 所有）
    async <n>               # 同步并发最大数量 n（建议 3 ~ 100）
    task <n/ori>            # 解析获取 bnk 文件的数量 n 或者 ori（all 所有）
    cps <n>                 # 子进程的数量 n（并发数、建议 CPU 线程数量的三分之一即可）
    async <true/false>      # 子进程同步、异步并发（true 异步、false 同步）
commons: 
    wem build ori           # 获取所有音频资源 .wem
    wem build ori async     # 获取所有音频资源 .wem async=20
    bnk build ori           # 获取所有音效资源 .bnk
    bnk build ori cps       # 获取所有音效资源 .bnk（多进程、同步并发）默认 cps=3
详细看 wiki`;

let ori_body = `
                                    '
                                '' "
⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  " ' O ' ''
⠀⠀⠀⠀⠀⣷⣀⠀⠀⠀⠀⠀⣤⡀⠲⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢻⣿⣿⣤⡀⠀⠀⠀⣛⣿⣾⣿⣿⣶⣶⣦⣤⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣇⢇⢀⣴⣿⣿⣿⣿⣤⠊⣿⣦⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⢿⣯⣧⣷⢷⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣤⣿⣧⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣤⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⣤⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠒⠿⢿⣿⣿⠿⠿⠛⠉⢀⣤⣤⣶⣿⣿⣿⣿⣯⠁⠀⠀⢀⣾⣿⣷⢆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⣿⣿⣿⣿⣯⣾⠋⠿⣷⣤⣤⣿⣿⣷⣷⣧⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⢏⣿⣿⣿⣿⣦⢄⢈⢻⣿⣿⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠀⢠⢔⠸⣿⣿⣿⣿⣿⡀⢫⣿⣿⣿⣿⣎⣇⠇⠛⠋⠁⠀⠀⠀⠀
⠀⠀⠀⢀⢆⠃⠀⠀⠀⠻⣟⣿⣿⠛⠁⢀⣠⣾⣿⣿⣟⣧⢀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣏⠀⠀⠀⠀⠀⠀⠀⠈⠀⢀⣤⣾⣿⠟⠋⢀⣯⠓⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣗⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⠁⠀⠀⠀⢻⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠻⣷⣦⣆⣦⣦⣦⣦⣶⣶⣮⣯⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠉⠉⢹⡿⣿⣶⠀⠀⢀⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠟⠀⢈⣿⣿ ⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⣠⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⠛⠀⠀⠀⠀⠀⠀⠀
-----------------------------------
----------------------
-----------
----
-
`;

// process scripts
const bnkTaskScript = pt.join(__dirname, "index_bnk.js");

const gc = namespace.GlobalCmd.CLine();

// wem
function runWem()
{
    const wem = new namespace.RunOption();
    gc.append("wem").append("executer").param(executer =>
    {
        wem.executer = executer === "ori" ? "ori" : namespace.Verify.checkNumber(executer, "executer");
    }).run(cmd =>
    {
        run.Wm2OggSync(wem);
    });

    // 异步获取 wem 资源
    const wem_async = new namespace.AsyncRunOption();
    gc.append("wem").append("executer").param(executer =>
    {
        wem_async.executer = executer === "ori" ? "ori" : namespace.Verify.checkNumber(executer, "executer");
    }).append("async").param(aMax =>
    {
        wem_async.aMax = namespace.Verify.checkNumber(aMax, "async");
    }).run(cmd =>
    {
        run.Wem2Ogg(wem_async);
    });

    // 默认命令
    gc.append("wem").append("build").append("ori").run(cmd =>
    {
        run.Wm2OggSync(new namespace.RunOption());
    });

    gc.append("wem").append("build").append("ori").append("async").run(cmd =>
    {
        run.Wem2Ogg(new namespace.AsyncRunOption());
    });

    gc.append("wem").append("list").run(cmd =>
    {
        run.List.printWemCount();
    });

    // 都没有匹配
    gc.cmd = gc.compares;
    gc.run(cmd => console.log("wem no such command or option:", cmd.join(" ")));
}

// bnk
function runBnk()
{
    const bnk = new namespace.RunOption();
    gc.append("bnk").append("executer").param(executer =>
    {
        bnk.executer = executer === "ori" ? "ori" : namespace.Verify.checkNumber(executer, "executer");
    }).append("task").param(task =>
    {
        bnk.task = task === "ori" ? "ori" : namespace.Verify.checkNumber(task, "task");
    }).run(cmd =>
    {
        run.BnkExtractSyncTask(bnk);
    });

    const bnk_cps = new namespace.ChildProcessRunOption(bnkTaskScript);
    gc.append("bnk").append("executer").param(executer =>
    {
        bnk_cps.executer = executer === "ori" ? "ori" : namespace.Verify.checkNumber(executer, "executer");
    }).append("task").param(task =>
    {
        bnk_cps.task = task === "ori" ? "ori" : namespace.Verify.checkNumber(task, "task");
    }).append("cps").param(cMax =>
    {
        bnk_cps.cMax = namespace.Verify.checkNumber(cMax, "cps");
    }).append("async").param(isAsync =>
    {
        bnk_cps.isAsync = namespace.Verify.checkBool(isAsync, "async");
    }).run(cmd =>
    {
        run.BnkExtractCProcess(bnk_cps);
    });

    // 默认命令
    gc.append("bnk").append("build").append("ori").run(cmd =>
    {
        run.BnkExtractSyncTask(new namespace.RunOption());
    });
    gc.append("bnk").append("build").append("ori").append("cps").run(cmd =>
    {
        run.BnkExtractCProcess(new namespace.ChildProcessRunOption(bnkTaskScript));
    });

    gc.append("bnk").append("list").run(cmd =>
    {
        run.List.printBnkCount();
    });

    // 都没有匹配没有
    gc.cmd = gc.compares;
    gc.run(cmd => console.log("bnk no such command or option:", cmd.join(" ")));

}

// help
function printHelp()
{
    help && console.log(help);
    help = null
}

// ori body
function printOri()
{
    ori_body && console.log(ori_body);
    ori_body = null;
}

// running
new namespace.Try().tryError(() =>
{
    process.argv.includes("ori") && printOri();

    switch (gc.processArgs[0])
    {
        case "wem":
            runWem();
            break;
        case "bnk":
            runBnk();
            break;
        case "ori":
            printOri();
            break
        case "list":
            run.List.printWemCount();
            run.List.printBnkCount();
            break;
        default:
            printHelp();
            break;
    }

}, error =>
{
    const m = "\r\n[error]\t".concat(error, "\r\n");
    console.error(m);
});

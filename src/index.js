const wem2oggSync = require("./running/Wm2OggSync");
const wem2oggAndPromise = require("./running/Wem2Ogg");
const bnkExtractSync = require("./running/BnkExtractSync");

const namespace = require("./class");

const cmd = {
    wem: "wem",
    bnk: "bnk",
    promise: "promise",
    process: "process"
}

const s = Date.now();

process.on("exit", () =>
{
    console.log("--------------------exit----------------------");
    console.log(Date.now() - s + "ms exit")
});

if (process.argv.includes(cmd.wem) && process.argv.includes(cmd.promise))
{
    // wem to ogg promise
    wem2oggAndPromise(namespace.config.wemCMax);
}
else if (process.argv.includes(cmd.wem))
{
    // wem to ogg
    wem2oggSync();
}
else if (process.argv.includes(cmd.bnk))
{
    // bnk to ogg sync
    bnkExtractSync();
}
else if (process.argv.includes(cmd.process))
{
    // TODO: 多进程 bnk to ogg
}
else
{
    console.log("命令有误！！");
}

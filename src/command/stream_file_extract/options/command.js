const ParamsMapping = require("../../../class/ParamsMapping");

// 默认配置模板
const template = {
    count: 1,
    accordingLevelRepeat: false
};

/** 设置输出路径 */
const setOutputPath = new ParamsMapping("out", {
    key: "outputPath",
    description: "设置输出路径 outputPath = <path>",
    defaults: [process.cwd()],
    ...template
});

/** 设置日志保存路径 */
const setLogPath = new ParamsMapping("log", {
    key: "logPath",
    description: "设置日志保存路径 logPath = <path>",
    defaults: [process.cwd()],
    ...template
});

/** 设置异步并发的数量 */
const setAsyncNumber = new ParamsMapping("an", {
    key: "asyncNumber",
    description: "设置异步并发数量 asyncNumber = <[2, 1024]>",
    defaults: [8],
    ...template
});

/** 设置线程数量数量 */
const setThreadNumber = new ParamsMapping("tn", {
    key: "threadNumber",
    description: "设置线程数量 threadNumber = <[2, max_thread * 2]>",
    defaults: [2],
    ...template
});

/** 启用异步 */
const enableAsync = new ParamsMapping("ea", {
    key: "enableAsync",
    description: "启用异步 enAsync = <[true, t]>",
    defaults: ["t"],
    ...template
});

/** 启用多线程 */
const enableThread = new ParamsMapping("et", {
    key: "enableThread",
    description: "启用多线程 enableThread = <[true, t]>",
    defaults: ["t"],
    ...template
});

/** 启用生成 ID */
const enableId = new ParamsMapping("eid", {
    key: "enableId",
    description: "生成ID enableId = <[true, t]>",
    defaults: ["t"],
    ...template
});

/** 启用分类文件夹 */
const enableenableCreateTypeDir = new ParamsMapping("etp", {
    key: "enableenableCreateTypeDir",
    description: "创建分类文件夹 enableenableCreateTypeDir = <[true, t]>",
    defaults: ["t"],
    ...template
});

/** 显示可选项 */
const options = new ParamsMapping("opt", {
    key: "options",
    description: "显示可选项",
    count: 0,
    defaults: [],
    children: [
        setOutputPath,
        setLogPath,
        setAsyncNumber,
        setThreadNumber,
        enableAsync,
        enableThread,
        enableId,
        enableenableCreateTypeDir
    ]
});

// 注册任务
options.addTask("options", () => require("./index").printOptions());

// 设置路径
[setOutputPath, setLogPath]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setPath(e.key, params[0])));

// 设置数值
[setAsyncNumber, setThreadNumber]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setNumber(e.key, params[0])));

// 设置布尔值
[enableAsync, enableThread, enableId, enableenableCreateTypeDir]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setBoolean(e.key, params[0])));

module.exports = options;

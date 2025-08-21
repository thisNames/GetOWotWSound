const ParamsMapping = require("../../../class/ParamsMapping");

const DefaultOptions = require("../class/DefaultOptions");

// 默认配置模板
const template = {
    count: 1,
    accordingLevelRepeat: false
};

/** 字符串 设置生成的文件拓展名 */
const setExtname = new ParamsMapping("ext", {
    key: "extname",
    description: "设置生成的文件拓展名 extname = <.ogg>",
    defaults: [".ogg"],
    ...template
});

/** 字符串 生成过滤器 */
const setFilter = new ParamsMapping("fr", {
    key: "filter",
    description: "生成过滤器 filter = <[shortNameORId, wotw\\characters]>",
    defaults: [""],
    ...template
});


/** 设置 输出路径 */
const setOutputPath = new ParamsMapping("out", {
    key: "outputPath",
    description: "设置输出路径 outputPath = <path>",
    defaults: [DefaultOptions.defOutputPath],
    ...template
});

/** 设置 日志保存路径 */
const setLogPath = new ParamsMapping("log", {
    key: "logPath",
    description: "设置日志保存路径 logPath = <path>",
    defaults: [DefaultOptions.defLogPath],
    ...template
});

/** 设置 临时文件保存路径 */
const setTempPath = new ParamsMapping("tmp", {
    key: "tempPath",
    description: "临时文件保存路径 tempPath = <path>",
    defaults: [DefaultOptions.defTempPath],
    ...template
});

/** 设置 异步并发的数量 */
const setAsyncNumber = new ParamsMapping("an", {
    key: "asyncNumber",
    description: "设置异步并发数量 asyncNumber = <[2, max_thread]>",
    defaults: [2],
    ...template
});

/** 启用 异步 */
const enableAsync = new ParamsMapping("ea", {
    key: "enableAsync",
    description: "启用异步 enAsync = <[true, t]>",
    defaults: ["f"],
    ...template
});

/** 启用 生成 ID */
const enableId = new ParamsMapping("eid", {
    key: "enableId",
    description: "启用生成ID enableId = <[true, t]>",
    defaults: ["t"],
    ...template
});

/** 启用 分类文件夹 */
const enableCreateTypeDir = new ParamsMapping("ectd", {
    key: "enableCreateTypeDir",
    description: "启用创建分类文件夹 enableCreateTypeDir = <[true, t]>",
    defaults: ["t"],
    ...template
});

/** 启用 检索忽略大小写 */
const enableSIgnoreCase = new ParamsMapping("esic", {
    key: "enableSIgnoreCase",
    description: "启用检索忽略大小写 enableSIgnoreCase = <[true, t]>",
    defaults: ["f"],
    ...template
});

/** 启用 保存搜索结果为 json */
const enableSSjson = new ParamsMapping("essjson", {
    key: "enableSSjson",
    description: "启用保存搜索结果为json enableSSjson = <[true, t]>",
    defaults: ["f"],
    ...template
});

/** 启用 保存搜索结果为 log */
const enableSSlog = new ParamsMapping("esslog", {
    key: "enableSSlog",
    description: "启用保存搜索结果为log enableSSlog = <[true, t]>",
    defaults: ["f"],
    ...template
});

/** 启用 保存搜索结果为 log */
const enableSScsv = new ParamsMapping("esscsv", {
    key: "enableSScsv",
    description: "启用保存搜索结果为csv enableSScsv = <[true, t]>",
    defaults: ["f"],
    ...template
});

/** 枚举 只搜索 StreamedFiles */
const enumStreamedFile = new ParamsMapping("sw", {
    key: "sstreamfile",
    description: "只搜索 StreamedFiles searchEnum = 0",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false
});

/** 枚举 只搜索 SoundBanks */
const enumSoundBank = new ParamsMapping("sb", {
    key: "sboundfile",
    description: "只搜索 SoundBanks searchEnum = 1",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false
});

/** 显示可选项 */
const options = new ParamsMapping("opt", {
    key: "options",
    description: "查看默认可选项",
    count: 0,
    defaults: [],
    children: [
        setOutputPath,
        setLogPath,
        setTempPath,
        setAsyncNumber,
        setExtname,
        setFilter,
        enableAsync,
        enableId,
        enableCreateTypeDir,
        enableSIgnoreCase,
        enableSSjson,
        enableSSlog,
        enableSScsv,
        enumStreamedFile,
        enumSoundBank
    ]
});

// 注册任务
options.addTask("options", () => require("./index").printOptions());

// 设置枚举
enumStreamedFile.addTask(options.key + "." + enumStreamedFile.key, () => require("./index").setEnum("searchEnum", 0));
enumSoundBank.addTask(options.key + "." + enumSoundBank.key, () => require("./index").setEnum("searchEnum", 1));

// 设置路径
[setOutputPath, setLogPath, setTempPath]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setPath(e.key, params[0])));

// 设置数值
[setAsyncNumber]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setNumber(e.key, params[0])));

// 设置布尔值
[enableAsync, enableId, enableCreateTypeDir, enableSIgnoreCase, enableSSjson, enableSSlog, enableSScsv]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setBoolean(e.key, params[0])));

// 设置字符串
[setExtname, setFilter]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(options.key + "." + e.key, params => require("./index").setString(e.key, params[0])));

module.exports = options;

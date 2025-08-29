const ParamsMapping = require("../../../class/ParamsMapping");

const DefaultOptions = require("../class/DefaultOptions");

// 默认配置模板
const template = { count: 1, accordingLevelRepeat: false };
const count0Template = { count: 0, defaults: [], accordingLevelRepeat: false };


//#region 字符串
/** 字符串 设置生成的文件拓展名 */
const setExtname = new ParamsMapping("ext", {
    key: "extname",
    description: "生成的文件拓展名",
    defaults: [".ogg"],
    example: "documents/command/stream_file_extract/options/example/ext.txt",
    ...template
}).addTask("ext", params => require("./index").setString("extname", params[0]));

/** 字符串 生成过滤器 */
const setFilter = new ParamsMapping("fr", {
    key: "filter",
    description: "生成过滤器",
    defaults: ["complete"],
    example: "documents/command/stream_file_extract/options/example/fr.txt",
    ...template
}).addTask("fr", params => require("./index").setString("filter", params[0]));
//#endregion


//#region 设置文件路径
/** 字符串 使用自定义的 StreamedFiles.json 结构文件 */
const setCustomSFStruct = new ParamsMapping("cwem", {
    key: "customSFStruct",
    description: "使用自定义的 StreamedFiles.json 结构文件",
    defaults: ["mySFStruct.json"],
    example: "documents/command/stream_file_extract/options/example/cwem.txt",
    ...template
}).addTask("cwem", params => require("./index").setFilePath("customSFStruct", params[0]));

/** 字符串 使用自定义的 SoundBanks.json 结构文件 */
const setCustomSBKStruct = new ParamsMapping("cbnk", {
    key: "customSBKStruct",
    description: "使用自定义的 SoundBanks.json 结构文件",
    defaults: ["mySBKStruct.json"],
    example: "documents/command/stream_file_extract/options/example/cbnk.txt",
    ...template
}).addTask("cbnk", params => require("./index").setFilePath("customSBKStruct", params[0]));
//#endregion


//#region 目录路径
/** 设置 输出目录 */
const setOutputPath = new ParamsMapping("out", {
    key: "outputPath",
    description: "设置文件生成的输出目录",
    example: "documents/command/stream_file_extract/options/example/out.txt",
    defaults: [DefaultOptions.defOutputPath],
    ...template
}).addTask("out", params => require("./index").setPath("outputPath", params[0]));

/** 设置 日志保存目录 */
const setLogPath = new ParamsMapping("log", {
    key: "logPath",
    description: "设置日志保存目录",
    defaults: [DefaultOptions.defLogPath],
    example: "documents/command/stream_file_extract/options/example/log.txt",
    ...template
}).addTask("log", params => require("./index").setPath("logPath", params[0]));

/** 设置 临时文件保存目录 */
const setTempPath = new ParamsMapping("tmp", {
    key: "tempPath",
    description: "设置临时文件保存目录",
    defaults: [DefaultOptions.defTempPath],
    example: "documents/command/stream_file_extract/options/example/tmp.txt",
    ...template
}).addTask("tmp", params => require("./index").setPath("tempPath", params[0]));
//#endregion


//#region 数值
/** 设置 异步并发的数量 */
const setAsyncNumber = new ParamsMapping("an", {
    key: "asyncNumber",
    description: "异步并发数量, HDD=2, SATA<=6, NVMe<=12",
    defaults: [3],
    example: "documents/command/stream_file_extract/options/example/an.txt",
    ...template
}).addTask("an", params => require("./index").setNumber("asyncNumber", params[0]));
//#endregion


//#region 布尔
/** 启用 异步 */
const enableAsync = new ParamsMapping("ea", {
    key: "enableAsync",
    description: "异步并发处理",
    defaults: ["f"],
    example: "documents/command/stream_file_extract/options/example/ea.txt",
    ...template
}).addTask("ea", params => require("./index").setBoolean("enableAsync", params[0]));

/** 启用 生成 ID */
const enableId = new ParamsMapping("eid", {
    key: "enableId",
    description: "在生成的文件前面加上文件 ID",
    defaults: ["t"],
    example: "documents/command/stream_file_extract/options/example/eid.txt",
    ...template
}).addTask("eid", params => require("./index").setBoolean("enableId", params[0]));

/** 启用 分类文件夹 */
const enableCreateTypeDir = new ParamsMapping("ectd", {
    key: "enableCreateTypeDir",
    description: "生成文件时，为文件创建分类文件夹",
    defaults: ["t"],
    example: "documents/command/stream_file_extract/options/example/ecid.txt",
    ...template
}).addTask("ectd", params => require("./index").setBoolean("enableCreateTypeDir", params[0]));

/** 启用 检索忽略大小写 */
const enableSIgnoreCase = new ParamsMapping("esic", {
    key: "enableSIgnoreCase",
    description: "检索搜索时，忽略大小写",
    defaults: ["f"],
    example: "documents/command/stream_file_extract/options/example/esic.txt",
    ...template
}).addTask("esic", params => require("./index").setBoolean("enableSIgnoreCase", params[0]));

/** 启用 保存搜索结果为 json */
const enableSSjson = new ParamsMapping("essjson", {
    key: "enableSSjson",
    description: "某些操作可将结果保存至 Json 文件",
    defaults: ["f"],
    example: "documents/command/stream_file_extract/options/example/essjson.txt",
    ...template
}).addTask("essjson", params => require("./index").setBoolean("enableSSjson", params[0]));

/** 启用 保存搜索结果为 log */
const enableSSlog = new ParamsMapping("esslog", {
    key: "enableSSlog",
    description: "某些操作可将结果保存至 Log 文件",
    defaults: ["f"],
    example: "documents/command/stream_file_extract/options/example/esslog.txt",
    ...template
}).addTask("esslog", params => require("./index").setBoolean("enableSSlog", params[0]));

/** 启用 保存搜索结果为 log */
const enableSScsv = new ParamsMapping("esscsv", {
    key: "enableSScsv",
    description: "某些操作可将结果保存至 Csv 文件",
    defaults: ["f"],
    example: "documents/command/stream_file_extract/options/example/esslog.txt",
    ...template
}).addTask("esscsv", params => require("./index").setBoolean("enableSScsv", params[0]));

/** 启用 HashId */
const enableHashId = new ParamsMapping("ehid", {
    key: "enableHashId",
    description: "在生成的文件前面加上文件 HashID",
    defaults: ["t"],
    example: "documents/command/stream_file_extract/options/example/ehid.txt",
    ...template
}).addTask("ehid", params => require("./index").setBoolean("enableHashId", params[0]));
//#endregion


//#region 枚举
/** 枚举 只搜索 StreamedFiles */
const enumStreamedFile = new ParamsMapping("sw", {
    key: "sStreamfile",
    description: "只搜索 StreamedFiles",
    example: "documents/command/stream_file_extract/options/example/searchEnum.txt",
    ...count0Template
}).addTask("sw", () => require("./index").setEnum("searchEnum", 0));

/** 枚举 只搜索 SoundBanks */
const enumSoundBank = new ParamsMapping("sb", {
    key: "sSoundBanks",
    description: "只搜索 SoundBanks",
    example: "documents/command/stream_file_extract/options/example/searchEnum.txt",
    ...count0Template
}).addTask("sb", () => require("./index").setEnum("searchEnum", 1));

/** 枚举 以 Id 查找重复定义的文件 */
const enumDuplicateId = new ParamsMapping("did", {
    key: "dplId",
    description: "以 Id 查找重复定义的文件",
    example: "documents/command/stream_file_extract/options/example/duplicateEnum.txt",
    ...count0Template
}).addTask("did", () => require("./index").setEnum("duplicateEnum", 0));

/** 枚举 以 ShortName 查找重复定义的文件 */
const enumDuplicateShortName = new ParamsMapping("dsn", {
    key: "dplShortName",
    description: "以 ShortName 查找重复定义的文件",
    example: "documents/command/stream_file_extract/options/example/duplicateEnum.txt",
    ...count0Template
}).addTask("dsn", () => require("./index").setEnum("duplicateEnum", 1));

/** 枚举 以 Id + ShortName 查找重复定义的文件 */
const enumDuplicateIdShortName = new ParamsMapping("didsn", {
    key: "dplIdShortName",
    description: "以 Id + ShortName 查找重复定义的文件",
    example: "documents/command/stream_file_extract/options/example/duplicateEnum.txt",
    ...count0Template
}).addTask("didsn", () => require("./index").setEnum("duplicateEnum", 2));
//#endregion


/** 显示可选项 */
const options = new ParamsMapping("opt", {
    key: "options",
    description: "查看运行时的可选项",
    count: 0,
    defaults: [],
    example: "documents/command/stream_file_extract/options/example/opt.txt",
    children: [
        setOutputPath,
        setLogPath,
        setTempPath,
        setAsyncNumber,
        setExtname,
        setFilter,
        setCustomSFStruct,
        setCustomSBKStruct,
        enableAsync,
        enableId,
        enableHashId,
        enableCreateTypeDir,
        enableSIgnoreCase,
        enableSSjson,
        enableSSlog,
        enableSScsv,
        enumStreamedFile,
        enumSoundBank,
        enumDuplicateId,
        enumDuplicateShortName,
        enumDuplicateIdShortName
    ]
}).addTask("options", () => require("./index").printOptions());

module.exports = options;

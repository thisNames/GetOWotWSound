const ParamsMapping = require("../../../class/ParamsMapping");

// 默认配置模板
const template = { count: 1, defaults: [process.cwd()], accordingLevelRepeat: false };

/** 设置 soundAssetsPath */
const setSoundAssetsPath = new ParamsMapping("sap", {
    key: "soundAssetsPath",
    description: "设置游戏音频资源所在的目录",
    example: "documents/command/stream_file_extract/config/example/sap.txt",
    ...template
}).addTask("sap", params => require("./index").setConfig("soundAssetsPath", params[0]));

/** 设置 ww2ogg */
const setWw2ogg = new ParamsMapping("w2g", {
    key: "ww2ogg",
    description: "设置 SoundMod/ww2ogg-v0.24.exe 工具路径",
    example: "documents/command/stream_file_extract/config/example/w2g.txt",
    ...template
}).addTask("w2g", params => require("./index").setConfig("ww2ogg", params[0]));

/** 设置 www2oggPacked */
const setWw2oggPacked = new ParamsMapping("w2gp", {
    key: "www2oggPacked",
    description: "设置 SoundMod/packed_codebooks_aoTuV_603.bin 文件路径",
    example: "documents/command/stream_file_extract/config/example/w2gp.txt",
    ...template
}).addTask("w2gp", params => require("./index").setConfig("www2oggPacked", params[0]));

/** 设置 revorb */
const setRevorb = new ParamsMapping("rev", {
    key: "revorb",
    description: "设置 SoundMod/revorb-v1.exe 工具路径",
    example: "documents/command/stream_file_extract/config/example/rev.txt",
    ...template
}).addTask("rev", params => require("./index").setConfig("revorb", params[0]));

/** 设置 bnkextr */
const setBnkextr = new ParamsMapping("bnk", {
    key: "bnkextr",
    description: "设置 SoundMod/bnkextr-v2.exe 工具路径",
    example: "documents/command/stream_file_extract/config/example/bnk.txt",
    ...template
}).addTask("bnk", params => require("./index").setConfig("bnkextr", params[0]));

/** 还原默认配置 */
const setDefault = new ParamsMapping("def", {
    key: "default",
    description: "还原默认配置",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false,
    example: "documents/command/stream_file_extract/config/example/def.txt"
}).addTask("def", () => require("./index").resetConfig());

/** 显示项目的配置 */
const config = new ParamsMapping("cfg", {
    key: "config",
    count: 0,
    defaults: [],
    description: "显示项目的配置",
    children: [setSoundAssetsPath, setWw2ogg, setWw2oggPacked, setRevorb, setBnkextr, setDefault],
    example: "documents/command/stream_file_extract/config/example/cfg.txt"
}).addTask("config", () => require("./index").printConfig());

module.exports = config;

const ParamsMapping = require("../../../class/ParamsMapping");

// 默认配置模板
const template = { count: 1, defaults: [process.cwd()], accordingLevelRepeat: false };

/** 设置 soundAssetsPath */
const setSoundAssetsPath = new ParamsMapping("sap", {
    key: "soundAssetsPath",
    description: "设置游戏资源目录, soundAssetsPath = <path>",
    ...template
}).addTask("sap", params => require("./index").setConfig("soundAssetsPath", params[0]));

/** 设置 ww2ogg */
const setWw2ogg = new ParamsMapping("w2g", {
    key: "ww2ogg",
    description: "设置, ww2ogg = <path>",
    ...template
}).addTask("w2g", params => require("./index").setConfig("ww2ogg", params[0]));

/** 设置 www2oggPacked */
const setWw2oggPacked = new ParamsMapping("w2gp", {
    key: "www2oggPacked",
    description: "设置, www2oggPacked = <path>",
    ...template
}).addTask("w2gp", params => require("./index").setConfig("www2oggPacked", params[0]));

/** 设置 revorb */
const setRevorb = new ParamsMapping("rev", {
    key: "revorb",
    description: "设置, revorb = <path>",
    ...template
}).addTask("rev", params => require("./index").setConfig("revorb", params[0]));

/** 设置 bnkextr */
const setBnkextr = new ParamsMapping("bnk", {
    key: "bnkextr",
    description: "设置, bnkextr = <path>",
    ...template
}).addTask("bnk", params => require("./index").setConfig("bnkextr", params[0]));

/** 还原默认配置 */
const setDefault = new ParamsMapping("def", {
    key: "default",
    description: "还原默认配置",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false
}).addTask("def", () => require("./index").resetConfig());

/** 显示项目的配置 */
const config = new ParamsMapping("cfg", {
    key: "config",
    count: 0,
    defaults: [],
    description: "显示项目的配置",
    children: [setSoundAssetsPath, setWw2ogg, setWw2oggPacked, setRevorb, setBnkextr, setDefault]
}).addTask("config", () => require("./index").printConfig());

module.exports = config;

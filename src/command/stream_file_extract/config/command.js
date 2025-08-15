const ParamsMapping = require("../../../class/ParamsMapping");

// 默认配置模板
const template = {
    count: 1,
    defaults: [process.cwd()],
    accordingLevelRepeat: false
};

/** 设置 soundAssetsPath */
const setSoundAssetsPath = new ParamsMapping("sap", {
    key: "soundAssetsPath",
    description: "设置 soundAssetsPath = <path>",
    ...template
});

/** 设置 ww2ogg */
const setWw2ogg = new ParamsMapping("w2g", {
    key: "ww2ogg",
    description: "设置 ww2ogg = <path>",
    ...template
});

/** 设置 www2ogg_packed_codebooks_aoTuV_603 */
const setWw2oggPacked = new ParamsMapping("w2gp", {
    key: "www2oggPacked",
    description: "设置 www2oggPacked = <path>",
    ...template
});

/** 设置 revorb */
const setRevorb = new ParamsMapping("rev", {
    key: "revorb",
    description: "设置 revorb = <path>",
    ...template
});

/** 设置 bnkextr */
const setBnkextr = new ParamsMapping("bnk", {
    key: "bnkextr",
    description: "设置 bnkextr = <path>",
    ...template
});

/** 还原默认配置 */
const resetConfig = new ParamsMapping("def", {
    key: "defaults",
    description: "还原默认的配置文件",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false
});

/** 显示项目的配置 */
const config = new ParamsMapping("cfg", {
    key: "config",
    count: 0,
    defaults: [],
    description: "显示项目的配置",
    children: [setSoundAssetsPath, setWw2ogg, setWw2oggPacked, setRevorb, setBnkextr, resetConfig]
});

// 注册任务
config.addTask("config", () => require("./index").printConfig());

// 还原默认配置
resetConfig.addTask("config.default", () => require("./index").resetConfig());

// 设置路径
[setSoundAssetsPath, setWw2ogg, setWw2oggPacked, setRevorb, setBnkextr]
    .map(e => ({ key: e.key, pmg: e }))
    .forEach(e => e.pmg.addTask(config.key + "." + e.key, params => require("./index").setConfig(e.key, params[0])));

module.exports = config;

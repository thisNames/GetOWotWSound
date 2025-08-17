const ParamsMapping = require("../../../class/ParamsMapping");

/** 清除缓存生成的文件 */
const clearCacheFile = new ParamsMapping("cl", {
    key: "clear",
    description: "清除之前生成的缓存文件（并不会删除）",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false
});

/** 删除缓存 */
const deleteCacheFile = new ParamsMapping("del", {
    key: "delete",
    description: "删除所有生成的缓存文件（会删除缓存文件 .temp）",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false
});

/** 树摇 */
const treeShake = new ParamsMapping("trs", {
    key: "treeshake",
    description: "将 SoundBnkInfo 中多余的字段统统删除，并生成缓存文件",
    count: 0,
    defaults: [],
    children: [clearCacheFile, deleteCacheFile]
});

// 注册任务
treeShake.addTask("treeShake", (...args) => require("./index").cacheGenerator(...args));
clearCacheFile.addTask("treeShake.clear", () => require("./index").clearCacheFile());

module.exports = treeShake;


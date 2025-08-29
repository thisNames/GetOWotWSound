const ParamsMapping = require("../../../class/ParamsMapping");

/** 清除缓存生成的文件 */
const clearCacheFile = new ParamsMapping("clr", {
    key: "clear",
    description: "清除之前生成的缓存文件（标记为已删除）",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false,
    example: "documents/command/stream_file_extract/tree_shake/example/clr.txt"
}).addTask("clr", () => require("./index").clearCacheFile());

/** 删除缓存 */
const deleteCacheFile = new ParamsMapping("del", {
    key: "delete",
    description: "删除所有生成的缓存文件（删除缓存文件.temp）",
    count: 0,
    defaults: [],
    accordingLevelRepeat: false,
    example: "documents/command/stream_file_extract/tree_shake/example/del.txt"
}).addTask("del", () => require("./index").deleteCacheFile());

/** 树摇 */
const treeShake = new ParamsMapping("trs", {
    key: "treeshake",
    description: "将 SoundBnkInfo 中多余的字段统统删除，并生成缓存文件（可提高加载速度）",
    count: 0,
    defaults: [],
    children: [clearCacheFile, deleteCacheFile],
    example: "documents/command/stream_file_extract/tree_shake/example/trs.txt"
}).addTask("trs", (...args) => require("./index").cacheGenerator(...args));

module.exports = treeShake;

const ParamsMapping = require("../../../class/ParamsMapping");

/** 搜索全部 */
const search = new ParamsMapping("s", {
    key: "search",
    description: "搜索 SoundBanksInfo 中定义的文件。默认搜索全部",
    count: 1,
    defaults: ["complete"],
    example: "documents/command/stream_file_extract/search/example/s.txt"
}).addTask("search", (...args) => require("./index")(...args));

module.exports = search;

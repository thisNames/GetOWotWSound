const ParamsMapping = require("../../../class/ParamsMapping");

/** 查找未定义的文件 */
const difference = new ParamsMapping("dif", {
    key: "difference",
    count: 0,
    defaults: [],
    description: "查找未定义的文件",
    example: "documents/command/stream_file_extract/difference/example/dif.txt"
}).addTask("difference", (...args) => require("./index")(...args));

module.exports = difference;

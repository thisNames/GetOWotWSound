const ParamsMapping = require("../../../class/ParamsMapping");

/** 查找重复定义的文件 */
const duplicate = new ParamsMapping("dpl", {
    key: "duplicate",
    count: 0,
    defaults: [],
    description: "查找重复定义的文件",
    example: "documents/command/stream_file_extract/duplicate/example/dpl.txt"
}).addTask("duplicate", (...args) => require("./index")(...args));

module.exports = duplicate;

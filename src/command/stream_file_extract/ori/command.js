const ParamsMapping = require("../../../class/ParamsMapping");

/** 打印一个 ori */
const oriBody = new ParamsMapping("ori", {
    key: "oribody",
    description: "在控制台随机打印一个 ori 或者 logo",
    count: 0,
    defaults: [],
    example: "documents/command/stream_file_extract/ori/example/ori.txt"
}).addTask("ori", () => require("./index")());

module.exports = oriBody;

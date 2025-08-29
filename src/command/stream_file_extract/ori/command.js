const ParamsMapping = require("../../../class/ParamsMapping");

/** 打印一个 ori */
const oriBody = new ParamsMapping("ori", {
    key: "oribody",
    description: "打印一个 ori",
    count: 0,
    defaults: [],
    example: "documents/command/stream_file_extract/ori/example/ori.txt"
}).addTask("ori", () => require("./index")());

module.exports = oriBody;

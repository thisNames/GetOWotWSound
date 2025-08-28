const ParamsMapping = require("../../../class/ParamsMapping");

/** 打印一个 ori */
const oriBody = new ParamsMapping("ori", {
    key: "oribody",
    description: "打印一个 ori",
    count: 0,
    defaults: []
}).addTask("ori", () => require("./index")());

module.exports = oriBody;

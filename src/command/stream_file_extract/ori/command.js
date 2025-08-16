const ParamsMapping = require("../../../class/ParamsMapping");

/** 打印一个 ori */
const oriBody = new ParamsMapping("ori", {
    key: "oribody",
    description: "打印一个 ori",
    count: 0,
    defaults: []
});


// 注册任务
oriBody.addTask("ori", () => require("./index")());

module.exports = oriBody;

const ParamsMapping = require("../../../class/ParamsMapping");

/** 显示项目所在的目录 */
const oriBody = new ParamsMapping("gpt", {
    key: "getproject",
    description: "显示项目所在的目录",
    count: 0,
    defaults: []
});


// 注册任务
oriBody.addTask("project", () => require("./index")());

module.exports = oriBody;

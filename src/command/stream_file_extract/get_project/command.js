const ParamsMapping = require("../../../class/ParamsMapping");

/** 显示项目所在的目录 */
const project = new ParamsMapping("gpt", {
    key: "project",
    description: "显示项目所在的目录",
    count: 0,
    defaults: []
}).addTask("project", () => require("./index")());

module.exports = project;

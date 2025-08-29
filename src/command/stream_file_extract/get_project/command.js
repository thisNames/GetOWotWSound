const ParamsMapping = require("../../../class/ParamsMapping");

/** 显示项目所在的目录 */
const project = new ParamsMapping("gpt", {
    key: "project",
    description: "用于查看项目所在路径",
    count: 0,
    defaults: [],
    example: "documents/command/stream_file_extract/get_project/example/gpt.txt"
}).addTask("project", () => require("./index")());

module.exports = project;

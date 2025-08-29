const ParamsMapping = require("../../class/ParamsMapping");

// 显示当前版本
const version = new ParamsMapping("v", {
    key: "version",
    count: 0,
    defaults: [],
    description: "显示当前版本",
    example: "src/command/print_version/example/version.txt"
});

// 注册任务
version.addTask("version", (...args) =>
{
    require("./index")(...args);
});


module.exports = [version];

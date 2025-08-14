const ParamsMapping = require("../../class/ParamsMapping");

// 显示帮助
const help = new ParamsMapping("h", {
    key: "help",
    count: -1,
    defaults: [],
    description: "显示帮助文档，-h [command1 command2 ...] 可查看指定命令的帮助文档",
    example: "example/help.txt",
    before: true
});

// 注册任务
help.addTask("help", (...args) =>
{
    require("./index")(...args);
});

module.exports = [help];

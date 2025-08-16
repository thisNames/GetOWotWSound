const ParamsMapping = require("../../../class/ParamsMapping");

/** 搜索 */
const search = new ParamsMapping("si", {
    key: "search",
    description: "搜索 si = <[shortNameORId, wotw\\characters>",
    count: 1,
    defaults: [""],
    children: []
});



// 添加任务
search.addTask("search", (...args) => require("./search")(...args));

module.exports = search;

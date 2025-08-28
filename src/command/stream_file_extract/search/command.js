const ParamsMapping = require("../../../class/ParamsMapping");

/** 搜索全部 */
const search = new ParamsMapping("s", {
    key: "search",
    description: "搜索全部 s = <[shortNameORId, wotw\\characters]>",
    count: 1,
    defaults: ["complete"]
}).addTask("search", (...args) => require("./index")(...args));

module.exports = search;

const ParamsMapping = require("../../../class/ParamsMapping");

/** 提取 StreamedFiles 文件 */
const wemExtract = new ParamsMapping("wem", {
    key: "streamfile",
    count: 0,
    defaults: [],
    description: "提取音乐文件 .wem => StreamedFiles ⊆ SoundBanks"
});

// 添加任务
wemExtract.addTask("streamfile", (...args) => require("./index")(...args));

module.exports = wemExtract;

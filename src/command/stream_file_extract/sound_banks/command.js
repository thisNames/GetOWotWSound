const ParamsMapping = require("../../../class/ParamsMapping");

// 提取 SoundBanks 文件
const bnkExtract = new ParamsMapping("bnk", {
    key: "soundfile",
    count: 0,
    defaults: [],
    description: "提取音乐、音效文件 .bnk => SoundBanks"
}).addTask("soundfile", (...args) => require("./index")(...args));

module.exports = bnkExtract;

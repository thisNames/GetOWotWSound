const ParamsMapping = require("../../../class/ParamsMapping");

// 提取 StreamedFiles 文件
const wemExtract = new ParamsMapping("wem", {
    key: "streamfile",
    count: 0,
    defaults: [],
    description: "提取音乐文件 .wem => StreamedFiles ⊆ SoundBanks"
});

module.exports = wemExtract;

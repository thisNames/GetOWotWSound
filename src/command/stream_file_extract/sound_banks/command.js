const ParamsMapping = require("../../../class/ParamsMapping");

// 提取 SoundBanks 文件
const bnkExtract = new ParamsMapping("bnk", {
    key: "soundfile",
    count: 0,
    defaults: [],
    description: "提取音频资源文件，从 SoundBanks 中获取",
    example: "documents/command/stream_file_extract/sound_banks/example/bnk.txt"
}).addTask("soundfile", (...args) => require("./index")(...args));

module.exports = bnkExtract;

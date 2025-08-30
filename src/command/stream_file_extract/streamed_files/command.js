const ParamsMapping = require("../../../class/ParamsMapping");

/** 提取 StreamedFiles 文件 */
const wemExtract = new ParamsMapping("wem", {
    key: "streamfile",
    count: 0,
    defaults: [],
    description: "提取音频资源文件，从 StreamedFiles 中获取，StreamedFiles ⊆ SoundBanks",
    example: "documents/command/stream_file_extract/streamed_files/example/wem.txt"
}).addTask("streamfile", (...args) => require("./index")(...args));

module.exports = wemExtract;

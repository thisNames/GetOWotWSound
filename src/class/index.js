/**
 *  统一命名空间
 */

// lib
const Executor = require("./lib/Executor");
const ConfigLoader = require("./lib/ConfigLoader");

// model
const Config = require("./model/Config");
const AudioItem = require("./model/AudioItem");
const MemoryFiles = require("./model/MemoryFiles");
const SoundBank = require("./model/SoundBank");
const StreamedFiles = require("./model/StreamedFiles");

// class
const Bnkextr = require("./class/Bnkextr");
const Ww2ogg = require("./class/Ww2ogg");
const Revorb = require("./class/Revorb");
const ReferencedStreamedFile = require("./class/ReferencedStreamedFile");
const IncludedMemoryFile = require("./class/IncludedMemoryFile");
const ProcessSet = require("./class/ProcessSet");

// tools
const MessageCollect = require("./tools/MessageCollect");
const RunningLog = require("./tools/RunningLog");

// 统一配置，工具
const config = new Config("config", "config.properties");
const ww2ogg = new Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
const revorb = new Revorb(config.revorb);
const bnk2wm = new Bnkextr(config.bnk2wem);


// 公共资源
const pt = require("node:path");

// json 文件
const SoundbanksInfoJson = require(pt.resolve(config.soundAssetsPath, "SoundbanksInfo.json"));

// 暴露数据
module.exports = {
    Executor,
    ConfigLoader,
    Config,
    AudioItem,
    MemoryFiles,
    SoundBank,
    StreamedFiles,
    Bnkextr,
    Ww2ogg,
    Revorb,
    ReferencedStreamedFile,
    IncludedMemoryFile,
    ProcessSet,
    MessageCollect,
    RunningLog,
    config,
    ww2ogg,
    revorb,
    bnk2wm,
    SoundbanksInfoJson
}

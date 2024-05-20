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
const ProcessPools = require("./class/ProcessPools");

// tools
const MessageCollect = require("./tools/MessageCollect");
const RunningLog = require("./tools/RunningLog");

// 统一配置，工具
const config = new Config("config", "config.properties");
const ww2ogg = new Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
const revorb = new Revorb(config.revorb);
const bnk2wm = new Bnkextr(config.bnk2wem);

// json 文件
const pt = require("node:path");

// 注意：require 函数走的是相对路径
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
    ProcessPools,
    MessageCollect,
    RunningLog,
    config,
    ww2ogg,
    revorb,
    bnk2wm,
    SoundbanksInfoJson
}

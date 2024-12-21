/**
 *  统一命名空间
 */

// lib
const Executor = require("./lib/Executor");
const ConfigLoader = require("./lib/ConfigLoader");

// model
const AudioItem = require("./model/AudioItem");
const MemoryFiles = require("./model/MemoryFiles");
const SoundBank = require("./model/SoundBank");
const StreamedFiles = require("./model/StreamedFiles");
const BnkSendData = require("./model/BnkSendData");
const BnkAcceptData = require("./model/BnkAcceptData");

// option
const Config = require("./option/Config");
const RunOption = require("./option/RunOption");
const AsyncRunOption = require("./option/AsyncRunOption");
const ChildProcessRunOption = require("./option/ChildProcessRunOption");

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
const GlobalCmd = require("./tools/GlobalCmd");
const Verify = require("./tools/Verify");
const Try = require("./tools/Try");

const params = new Try().tryError(() =>
{
    // 统一配置，工具
    const config = new Config("config", "config.properties");
    const ww2ogg = new Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
    const revorb = new Revorb(config.revorb);
    const bnk2wm = new Bnkextr(config.bnk2wem);

    // SoundbanksInfo.json 文件
    const SoundbanksInfoJson = require(config.soundbanksInfo);

    return { config, ww2ogg, revorb, bnk2wm, SoundbanksInfoJson }

}, error =>
{
    const m = "\r\n[error]\t".concat(error, "\r\n");
    console.error(m);
});

const { config, ww2ogg, revorb, bnk2wm, SoundbanksInfoJson } = params;

// 暴露数据
module.exports = {
    Executor,
    ConfigLoader,
    Config,
    RunOption,
    AsyncRunOption,
    ChildProcessRunOption,
    AudioItem,
    MemoryFiles,
    SoundBank,
    StreamedFiles,
    BnkAcceptData,
    BnkSendData,
    Bnkextr,
    Ww2ogg,
    Revorb,
    ReferencedStreamedFile,
    IncludedMemoryFile,
    ProcessSet,
    MessageCollect,
    GlobalCmd,
    RunningLog,
    Verify,
    Try,
    config,
    ww2ogg,
    revorb,
    bnk2wm,
    SoundbanksInfoJson
}

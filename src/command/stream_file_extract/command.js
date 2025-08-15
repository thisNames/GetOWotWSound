// 配置命令
const config = require("./config/command");

// 打印一个 ori
const ori = require("./ori/command");

// 显示可选项
const options = require("./options/command");

// 提取 StreamedFiles 文件
const wemExtract = require("./streamed_files/command");

// 提取 SoundBanks 文件
const bnkExtract = require("./sound_banks/command");

module.exports = [config, options, wemExtract, bnkExtract, ori];

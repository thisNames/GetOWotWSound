// 配置命令
const config = require("./config/command");

// 打印一个 ori
const ori = require("./ori/command");

// 显示可选项
const options = require("./options/command");

// 搜索
const search = require("./search/command");

// 树摇
const treeShake = require("./tree_shake/command");

// 提取 StreamedFiles 文件
const wemExtract = require("./streamed_files/command");

// 提取 SoundBanks 文件
const bnkExtract = require("./sound_banks/command");

// 显示项目所在的目录
const getProject = require("./get_project/command");

// 查找重复定义的文件
const duplicate = require("./duplicate/command");

module.exports = [getProject, config, options, wemExtract, bnkExtract, treeShake, search, ori, duplicate];

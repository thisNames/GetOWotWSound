const Config = require("../option/Config");
const SoundBank = require("./SoundBank");
const FileItem = require("../lib/FileItems");

/**
 * 内存文件
 * @description 实例记得先调用 setTools 方法
 * @deprecated 直接继承 FileItem 类即可
 */
class MemoryFiles extends FileItem
{
    /**
    * @param {Config} config
    * @param {SoundBank} SoundBank 
    */
    constructor(config, SoundBank)
    {
        super(config);
        this.SoundBank = SoundBank;
    }
}

module.exports = MemoryFiles;
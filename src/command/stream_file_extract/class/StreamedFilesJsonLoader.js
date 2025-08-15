const fs = require("node:fs");
const pt = require("node:path");

const StreamedFile = require("./StreamedFile");
const SoundBank = require("./SoundBank");

/**
 *  StreamedFiles Json 加载器
 */
class SoundBanksInfoJsonLoader
{
    /**
     *  @param {String}  soundBanksInfoJsonFilePath  SoundBanksInfo.json 文件路径
     */
    constructor(soundBanksInfoJsonFilePath)
    {
        /** @type {String} SoundBanksInfo.json 文件路径 */
        this.soundBanksInfoJsonFilePath = soundBanksInfoJsonFilePath;


        /** @type {String} 加载器名称 */
        this.__loaderName = "SoundBanksInfoJsonLoader";

        /** @type {String} 读取 SoundBanksInfo.json 文件后的名字 */
        this.__sbiJsonName = pt.basename(this.soundBanksInfoJsonFilePath);
    }

    /**
     *  检查 SoundBanksInfo.json 文件是否存在
     *  @returns {Boolean}
     */
    __checkFileExists()
    {
        return fs.existsSync(this.soundBanksInfoJsonFilePath) && fs.statSync(this.soundBanksInfoJsonFilePath).isFile();
    }

    /**
     *  读取 SoundBanksInfo.json 文件
     *  @returns {Object}
     *  @throws { Error }  文件不存在
     *  @throws { Error }  读取错误
     */
    __loaderSoundBanksInfo()
    {
        // 没用这样的文件
        if (!this.__checkFileExists()) throw new Error(`${this.__loaderName}: No such file => ${this.__sbiJsonName}`);

        try
        {
            return require(this.soundBanksInfoJsonFilePath);
        } catch (error)
        {
            // 读取错误
            throw new Error(`${this.__loaderName}: Error while reading: ${this.__sbiJsonName} => ${error.message || "Unknown error"}`);
        }
    }

    /**
     *  加载 SoundBanksInfo.json 文件中的 StreamedFiles 配置
     *  @returns {Array<StreamedFile>} 读取后的 StreamedFile 集合
     *  @throws { Error }  文件结构错误
     */
    loaderStreamedFiles()
    {
        let json = this.__loaderSoundBanksInfo();
        let streamedFiles = json?.SoundBanksInfo?.StreamedFiles;

        // 数据结构错误
        if (!Array.isArray(streamedFiles)) throw new Error(`${this.__loaderName}: ${this.__sbiJsonName} -> [SoundBanksInfo.StreamedFiles] field is not an array`);

        const listStreamedFile = [];

        // 读取数据
        for (let i = 0; i < streamedFiles.length; i++)
        {
            const item = streamedFiles[i];

            // 排除空值
            if (!item.Id || !item.ShortName) continue;

            listStreamedFile.push(new StreamedFile(item.Id, item.ShortName, "StreamedFiles"));
        }

        // 释放内存
        json = null;
        streamedFiles = null;

        return listStreamedFile;
    }

    /**
     *  加载 SoundBanksInfo.json 文件中的 SoundBanks 配置
     *  @returns {Array<StreamedFile>} 读取后的 SoundBank 集合
     *  @throws { Error }  文件结构错误
     */
    loaderSoundBanks()
    {
        let json = this.__loaderSoundBanksInfo();
        let soundBanks = json?.SoundBanksInfo?.SoundBanks;

        // 数据结构错误
        if (!Array.isArray(soundBanks)) throw new Error(`${this.__loaderName}: SoundBanksInfo.json -> [SoundBanksInfo.SoundBanks] field is not an array`);

        const listSoundBank = [];

        // 读取数据
        for (let i = 0; i < soundBanks.length; i++)
        {
            const item = soundBanks[i];
            const soundBank = new SoundBank(item.Id, item.Path);

            // 获取子项
            const includedMemoryFiles = item?.IncludedMemoryFiles;

            // 不是数组
            if (!Array.isArray(includedMemoryFiles)) continue;

            // 读取子项
            for (let j = 0; j < includedMemoryFiles.length; j++)
            {
                const item2 = includedMemoryFiles[j];

                // 排除空值
                if (!item2.Id || !item2.ShortName) continue;

                soundBank.StreamedFiles.push(new StreamedFile(item2.Id, item2.ShortName, "SoundBanks"));
            }

            listSoundBank.push(soundBank);
        }

        // 释放内存
        json = null;
        soundBanks = null;

        return listSoundBank;
    }
}

module.exports = SoundBanksInfoJsonLoader;

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
    constructor(soundBanksInfoJsonFilePath = "")
    {
        /** @type {String} SoundBanksInfo.json 文件路径 */
        this.soundBanksInfoJsonFilePath = "";

        /** @type {Number} StreamedFile 文件个数 */
        this.streamedFileCount = 0;

        /** @type {Number} SoundBank 文件个数 */
        this.soundBankCount = 0;

        /** @type {Number} SoundBank 中的 SoundBankStreamedFile 文件个数 */
        this.soundBankStreamedFileCount = 0;

        /** @type {Object} 缓存 */
        this.__cache = null;

        this.setSoundBanksInfoJsonFilePath(soundBanksInfoJsonFilePath);
    }

    /**
     *  设置 SoundBanksInfo.json 文件路径
     *  @param {String} path
     *  @returns {void}
     */
    setSoundBanksInfoJsonFilePath(path)
    {
        if (this.soundBanksInfoJsonFilePath === path) return;

        this.soundBanksInfoJsonFilePath = path;

        this.clearCache();
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
        if (!this.__checkFileExists()) throw new Error(`Exists: No such file [${this.soundBanksInfoJsonFilePath}]`);

        try
        {
            if (this.__cache) return this.__cache;

            this.__cache = require(this.soundBanksInfoJsonFilePath);

            return this.__cache;
        } catch (error)
        {
            // 读取错误
            throw new Error(`Require: ${error.message || "Error"} [${this.soundBanksInfoJsonFilePath}]`);
        }
    }

    /**
     *  加载 SoundBanksInfo.json 文件中的 StreamedFiles 配置
     *  @description json?.SoundBanksInfo?.StreamedFiles;
     *  @returns {Array<StreamedFile>} 读取后的 StreamedFile 集合
     *  @throws { Error }  文件结构错误
     */
    loaderStreamedFiles()
    {
        let json = this.__loaderSoundBanksInfo();
        let streamedFiles = json?.SoundBanksInfo?.StreamedFiles;

        // 数据结构错误
        if (!Array.isArray(streamedFiles)) throw new Error(`loaderStreamedFiles: [SoundBanksInfo.StreamedFiles] field is not an array`);

        const listStreamedFile = [];

        // 读取数据
        for (let i = 0; i < streamedFiles.length; i++)
        {
            const item = streamedFiles[i];

            // 排除空值
            if (!item.Id || !item.ShortName) continue;

            listStreamedFile.push(new StreamedFile(item.Id, item.ShortName, "StreamedFiles"));
            this.streamedFileCount++;
        }

        // 释放内存
        json = null;
        streamedFiles = null;

        return listStreamedFile;
    }

    /**
     *  加载 SoundBanksInfo.json 文件中的 SoundBanks 配置
     *  @description json?.SoundBanksInfo?.SoundBanks
     *  @returns {Array<SoundBank>} 读取后的 SoundBank 集合
     *  @throws { Error }  文件结构错误
     */
    loaderSoundBanks()
    {
        let json = this.__loaderSoundBanksInfo();
        let soundBanks = json?.SoundBanksInfo?.SoundBanks;

        // 数据结构错误
        if (!Array.isArray(soundBanks)) throw new Error(`loaderSoundBanks: [SoundBanksInfo.SoundBanks] field is not an array`);

        const listSoundBank = [];

        // 读取数据
        for (let i = 0; i < soundBanks.length; i++)
        {
            const item = soundBanks[i];
            const soundBank = new SoundBank(item.Id, item.Path);

            // 获取子项
            const includedMemoryFiles = item?.IncludedMemoryFiles || item?.ExcludedMemoryFiles;
            // 不是数组
            if (!Array.isArray(includedMemoryFiles)) continue;

            // 读取子项
            for (let j = 0; j < includedMemoryFiles.length; j++)
            {
                const item2 = includedMemoryFiles[j];

                // 排除空值
                if (!item2.Id || !item2.ShortName) continue;

                soundBank.IncludedMemoryFiles.push(new StreamedFile(item2.Id, item2.ShortName, "SoundBanks"));
                this.soundBankStreamedFileCount++;
            }

            listSoundBank.push(soundBank);
            this.soundBankCount++;
        }

        // 释放内存
        json = null;
        soundBanks = null;

        return listSoundBank;
    }

    /**
     *  清除缓存
     *  @returns {void}
     */
    clearCache()
    {
        if (this.__cache)
        {
            require.cache[this.__cache];
            this.__cache = null;
        }
    }
}

module.exports = SoundBanksInfoJsonLoader;

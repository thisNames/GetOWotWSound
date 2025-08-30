const fs = require("node:fs");

const StreamedFilesJsonLoader = require("./StreamedFilesJsonLoader");
const SoundBanksInfoData = require("./SoundBanksInfoData");
const Utils = require("../class/Utils");

/**
 *  从缓存加载数据，没用就从游戏目录里加载
 */
class SoundBnkInfoCacheLoader
{
    /**
     *  @param {String} gameSoundBnkInfo 游戏目录下的 SoundBanksInfo.json 文件路径
     */
    constructor(gameSoundBnkInfo)
    {
        /** @type {String} 游戏目录下的 SoundBanksInfo.json 文件路径 */
        this.gameSoundBnkInfo = gameSoundBnkInfo;

        /** @type {StreamedFilesJsonLoader} json 加载器 */
        this.loader = new StreamedFilesJsonLoader();
    }

    /**
     *  清除缓存数据
     *  @returns {void}
     */
    clearCache()
    {
        this.loader.clearCache();
    }

    /**
     * 从缓存目录或者游戏目录加载 StreamedFiles.json 以及 SoundBanks.json 配置
     * @param {String} cacheStreamedFilesName SoundBanksInfo.StreamedFiles 缓存文件名称
     * @param {String} cacheSoundBanksName SoundBanksInfo.SoundBanks 缓存文件名称
     * @returns {SoundBanksInfoData} SoundBanksInfoData | Error
     */
    loaders(cacheStreamedFilesName, cacheSoundBanksName)
    {
        const loaderStreamedFilesRes = this.loaderStreamedFiles(cacheStreamedFilesName);
        const loaderSoundBanksRes = this.loaderSoundBanks(cacheSoundBanksName);

        // 加载失败或者文件缺失
        if (loaderStreamedFilesRes instanceof Error || loaderSoundBanksRes instanceof Error)
        {
            return new Error(`SoundBnkInfoCacheLoader.loaders => ${loaderStreamedFilesRes.message || loaderSoundBanksRes.message || "error"}`);
        }

        return new SoundBanksInfoData(loaderStreamedFilesRes.listStreamedFile, loaderSoundBanksRes.listSoundBank);
    }

    /**
     *  从缓存目录或者游戏目录加载 StreamedFiles.json 配置
     *  @param {String} cacheStreamedFilesName SoundBanksInfo.StreamedFiles 缓存文件名称
     *  @returns {SoundBanksInfoData} 配置的数据信息 | Error
     */
    loaderStreamedFiles(cacheStreamedFilesName)
    {
        const cacheStreamedFiles = Utils.getCacheSoundBnkInfoJsonPath(cacheStreamedFilesName, this.gameSoundBnkInfo);

        // 使用缓存
        try
        {
            this.loader.setSoundBanksInfoJsonFilePath(cacheStreamedFiles.cache ? cacheStreamedFiles.path : this.gameSoundBnkInfo);
            const listStreamedFile = this.loader.loaderStreamedFiles();

            return new SoundBanksInfoData(listStreamedFile, []);
        } catch (error)
        {
            return new Error(`SoundBnkInfoCacheLoader.loaderStreamedFiles => ${error.message || "error"}`);
        }
    }

    /**
     *  从缓存目录或者游戏目录加载 SoundBanks.json 配置
     *  @param {String} cacheSoundBanksName SoundBanksInfo.SoundBanks 缓存文件名称
     *  @returns {SoundBanksInfoData} 配置的数据信息 | Error
     */
    loaderSoundBanks(cacheSoundBanksName)
    {
        const cacheSoundBanks = Utils.getCacheSoundBnkInfoJsonPath(cacheSoundBanksName, this.gameSoundBnkInfo);

        // 使用缓存
        try
        {
            this.loader.setSoundBanksInfoJsonFilePath(cacheSoundBanks.cache ? cacheSoundBanks.path : this.gameSoundBnkInfo);
            const listSoundBank = this.loader.loaderSoundBanks();

            return new SoundBanksInfoData([], listSoundBank);
        } catch (error)
        {
            return new Error(`SoundBnkInfoCacheLoader.loaderSoundBanks => ${error.message || "error"}`);
        }
    }

    /**
     *  从缓存中加载 SoundBankInfo 数据
     *  @param {String} gameSoundBnkInfo 游戏资源目录里的 SoundBankInfo.json 文件路径
     *  @param {String} cacheStreamedFilesName SoundBanksInfo.StreamedFiles 缓存文件名称
     *  @param {String} cacheSoundBanksName SoundBanksInfo.SoundBanks 缓存文件名称
     *  @param {Number} searchEnum 搜索枚举 [0 - StreamedFiles, 1 - SoundBanks, n - StreamedFiles & SoundBanks]
     *  @returns {SoundBanksInfoData | Error}
     */
    static loader(gameSoundBnkInfo, cacheStreamedFilesName, cacheSoundBanksName, searchEnum)
    {
        /** @type {SoundBanksInfoData} */
        let soundBnkInfoData = null;
        const cacheLoaders = new SoundBnkInfoCacheLoader(gameSoundBnkInfo);

        // 枚举
        if (searchEnum == 0)
        {
            // 加载 StreamedFile
            soundBnkInfoData = cacheLoaders.loaderStreamedFiles(cacheStreamedFilesName);
        }
        else if (searchEnum == 1)
        {
            // 加载 SoundBank
            soundBnkInfoData = cacheLoaders.loaderSoundBanks(cacheSoundBanksName);
        }
        else
        {
            // 加载全部
            soundBnkInfoData = cacheLoaders.loaders(cacheStreamedFilesName, cacheSoundBanksName);
        }

        // 清除缓存
        cacheLoaders.clearCache();

        return soundBnkInfoData;
    }

    /**
     *  加载自定义的 StreamedFiles.json 文件
     *  @param {String} filepath 自定义的 StreamedFiles.json 文件路径
     *  @returns {SoundBanksInfoData | Error}
     */
    static loaderCustomSFStruct(filepath)
    {
        if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) return new Error(`SoundBnkInfoCacheLoader.static.loaderCustomSFStruct => ${filepath} is not a file`);

        try
        {
            const loader = new StreamedFilesJsonLoader(filepath);
            const listStreamedFile = loader.loaderStreamedFiles();

            return new SoundBanksInfoData(listStreamedFile, []);
        } catch (error)
        {
            return new Error(error.message);
        }
    }

    /**
     *  加载自定义的 SoundBanks.json 文件
     *  @param {String} filepath 自定义的 SoundBanks.json 文件路径
     *  @returns {SoundBanksInfoData | Error}
     */
    static loaderCustomSBKStruct(filepath)
    {
        if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) return new Error(`SoundBnkInfoCacheLoader.static.loaderCustomSBKStruct => ${filepath} is not a file`);

        try
        {
            const loader = new StreamedFilesJsonLoader(filepath);
            const listSoundBank = loader.loaderSoundBanks();

            return new SoundBanksInfoData([], listSoundBank);
        } catch (error)
        {
            return new Error(error.message);
        }
    }
}

module.exports = SoundBnkInfoCacheLoader;

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
     * @returns { SoundBanksInfoData } SoundBanksInfoData | Error
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
}

module.exports = SoundBnkInfoCacheLoader;

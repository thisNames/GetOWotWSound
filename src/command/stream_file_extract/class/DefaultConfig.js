const pt = require("node:path");

const Utils = require("./Utils");

/**
 *  默认配置
 */
class DefaultConfig
{
    /** @type {String} 本地配置文件名称 */
    static LOCAL_CONFIG = "config.json";

    /** @type {String} SoundBanksInfo.StreamedFiles 缓存文件名称 */
    static cacheStreamedFilesName = "SoundBanksInfo_StreamedFiles_cache.json";

    /** @type {String} SoundBanksInfo.SoundBanks 缓存文件名称 */
    static cacheSoundBanksName = "SoundBanksInfo_SoundBanks_cache.json";

    /** @type {String} SoundBanksInfo.json 文件名称 */
    static soundBnkInfoName = "SoundBanksInfo.json";

    constructor()
    {
        let rt = this.__getSoundModToolPath();

        /** @type {String} 资源目录 */
        this.soundAssetsPath = "";

        /** @type {String} ww2ogg.exe */
        this.ww2ogg = pt.join(rt, "ww2ogg-v0.24.exe");

        /** @type {String} www2ogg_packed_codebooks_aoTuV_603.bin */
        this.www2oggPacked = pt.join(rt, "packed_codebooks_aoTuV_603.bin");

        /** @type {String} revorb.exe */
        this.revorb = pt.join(rt, "revorb-v1.exe");

        /** @type {String} bnkextr.exe */
        this.bnkextr = pt.join(rt, "bnkextr-v2.exe");
    }

    /**
     *  获取工具的所在的目录
     *  @returns {String}
     *  @description 使用的绝对路径
     */
    __getSoundModToolPath()
    {
        return pt.join(Utils.getProjectRoot(), "SoundMod");
    }
}

module.exports = DefaultConfig;

const pt = require("node:path");

/**
 *  默认配置
 */
class DefaultConfig
{
    /** @type {String} 本地配置文件名称 */
    static LOCAL_CONFIG = "config.json";

    constructor()
    {
        /** @type {String} 资源目录 */
        this.soundAssetsPath = "";

        /** @type {String} ww2ogg.exe */
        this.ww2ogg = pt.join(this.__getSoundModToolPath(), "ww2ogg-v0.24.exe");

        /** @type {String} www2ogg_packed_codebooks_aoTuV_603.bin */
        this.www2oggPacked = pt.join(this.__getSoundModToolPath(), "packed_codebooks_aoTuV_603.bin");

        /** @type {String} revorb.exe */
        this.revorb = pt.join(this.__getSoundModToolPath(), "revorb-v1.exe");

        /** @type {String} bnkextrbnkextr.exe */
        this.bnkextr = pt.join(this.__getSoundModToolPath(), "bnkextr-v2.exe");
    }

    /**
     *  获取工具的所在的目录
     *  @returns {String}
     *  @description 使用的绝对路径
     */
    __getSoundModToolPath()
    {
        const indexJs = process.argv[1] + "";
        const dirName = pt.dirname(indexJs);

        return pt.join(dirName, "SoundMod");
    }
}

module.exports = DefaultConfig;

const pt = require("node:path");

/**
 * 一个音频文件
 */
class AudioItem
{
    // 值为 FID 的种子
    static FID_GEN = 10000;
    // 长度为 FID 的长度
    static __FID_LENGTH = AudioItem.FID_GEN.toFixed().length;

    /**
    *  获取一个 id
    *  @returns {String}
    */
    static buildFID()
    {
        const sid = Math.trunc(Math.random() * AudioItem.FID_GEN).toString(16);
        return sid.padEnd(AudioItem.__FID_LENGTH, "f") + Date.now();
    }

    /**
     * @param {String} Id 
     * @param {String} Language 
     * @param {String} ShortName 
     * @param {String} Path
     */
    constructor(Id, Language, ShortName, Path)
    {
        this.Id = AudioItem.buildFID().concat("_", Id);
        // this.Id = Id;
        this.Language = Language;
        this.ShortName = ShortName;
        this.Path = Path;
    }

    /**
     * 获取 id + 后缀名
     * @param {String} ext 后缀名（默认 .wem）
     * @returns {String}
     */
    getIdForName(ext = ".wem")
    {
        return this.Id + ext;
    }

    /**
     * 获取文件名称
     * @param {String} path 路径
     * @returns {String}
     * @example
     * 源路径：wcharacters\npc\grom\wellspringGladesGromAfterMill3.wav 
     * 类名称：wellspringGladesGromAfterMill3.wav
     */
    baseShortName()
    {
        return pt.basename(this.ShortName);
    }

    /**
     * 追加后缀名称
     * @param {String} fileName 文件名称
     * @param {String} ext 拓展名，默认 .ogg
     * @returns {String}
     * @example
     * 源名称：wcharacters\npc\grom\wellspringGladesGromAfterMill3.wav 
     * 最佳后：wcharacters\npc\grom\wellspringGladesGromAfterMill3.wav.ogg
     * 
     * 源名称：wellspringGladesGromAfterMill3.wav 
     * 最佳后：wellspringGladesGromAfterMill3.wav.ogg
     */
    appendExtName(fileName, ext = ".ogg")
    {
        return fileName.concat(ext);
    }

    /**
     * 获取类目名称
     * @param {String} path 路径
     * @returns {String}
     * @example 
     * 源路径：wcharacters\npc\grom\wellspringGladesGromAfterMill3.wav 
     * 类名称：wcharacters\npc\grom
     */
    getShortNameToTypeName()
    {
        return pt.dirname(this.ShortName);
    }
}

module.exports = AudioItem;
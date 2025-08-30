const pt = require("node:path");

/**
 * 可持续播放音频资源 流式文件 音乐动效
 * @description .wem 文件，资源类型。资源类型中的一种
 */
class StreamedFile
{
    /**
     * @param {String} Id 文件的 ID
     * @param {String} ShortName 空间名称
     * @param {"StreamedFiles" | "SoundBanks"} Type 资源类型
     * @param {String} BnkFile 资源类型路径 bnk
     */
    constructor(Id, ShortName, Type, BnkFile)
    {
        /** @type {String} 文件的 ID */
        this.Id = Id;

        /** @type {String} 空间名称 */
        this.ShortName = ShortName;

        /** @type {"StreamedFiles" | "SoundBanks"} 资源类型 资源类型 */
        this.Type = Type;

        /** @type {String} 资源类型路径 bnk */
        this.BnkFile = BnkFile;
    }

    /**
     * 获取 id + 后缀名
     * @param {String} ext 后缀名（默认 .wem）
     * @returns {String}
     */
    GetIdForName(ext = ".wem")
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
    GetFileName()
    {
        const on = pt.basename(this.ShortName).replace(/[\\/]+/g, "-");
        return on.split(".")[0] || on;
    }

    /**
     * 获取类目名称
     * @param {String} path 路径
     * @returns {String}
     * @example 
     * 源路径：wcharacters\npc\grom\wellspringGladesGromAfterMill3.wav 
     * 类名称：wcharacters\npc\grom
     */
    GetTypeName()
    {
        return pt.dirname(this.ShortName);
    }

    /**
     * 重写 toString
     * @returns {String}
     */
    toString()
    {
        return "#" + this.Id + " " + this.ShortName;
    }
}

module.exports = StreamedFile;

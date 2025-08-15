const StreamedFile = require("./StreamedFile");

/**
 * 短播放音频资源 小文件 音效
 * @description .bnk 文件，资源类型中的一种
 */
class SoundBank
{
    /**
     *  @param {String} Id SoundBank Id
     *  @param {String} Path SoundBank bnk 文件路径
     */
    constructor(Id, Path)
    {
        /** @type {String} SoundBank Id */
        this.Id = Id;

        /** @type {String} SoundBank bnk 文件路径 */
        this.Path = Path;

        /** @type {Array<StreamedFile>} SoundBank 资源列表 */
        this.StreamedFiles = [];
    }

    /**
     * 获取 bnk 文件的解压路径
     * @returns {String}
     */
    GetBnkExtractPath()
    {
        return this.Id + "." + this.Path;
    }
}

module.exports = SoundBank;

/**
 *  统计对象
 */
class Counter
{
    constructor()
    {
        /** @type {Number} .bnk 文件数量 */
        this.totalSoundBank = 0;
        /** @type {Number} .wem 文件数量 */
        this.totalStreamedFile = 0;

        /** @type {Number} .bnk 文件 提取成功 数量 */
        this.bnkExtractSuccess = 0;
        /** @type {Number} .bnk 文件 提取失败 数量 */
        this.bnkExtractFailed = 0;

        /** @type {Number} .wem 文件 转换成功 数量 */
        this.ww2oggSuccess = 0;
        /** @type {Number} .wem 文件 转换失败 数量 */
        this.ww2oggFailed = 0;

        /** @type {Number} revorb 转换成功 数量 */
        this.revorbSuccess = 0;
        /** @type {Number} revorb 转换失败 数量 */
        this.revorbFiled = 0;
    }

    /**
     *  @description .bnk 文件 提取率
     *  @returns {String} 0.00%
     */
    SoundBankExtractRate()
    {
        if (this.totalSoundBank == 0) return "0%";
        return this.__toPercent(this.bnkExtractSuccess / this.totalSoundBank);
    }

    /**
     *  @description .wem 文件 转换率
     *  @returns {String} 0.00%
     */
    StreamedFileConversionRate()
    {
        if (this.totalStreamedFile == 0) return "0%";
        return this.__toPercent(this.revorbSuccess / this.totalStreamedFile);
    }

    /**
     *  @description 转换为百分比
     *  @param {Number} value 数值
     *  @returns {String} 0.00%
     */
    __toPercent(value)
    {
        return (value * 100).toFixed(2) + "%";
    }
}

module.exports = Counter;

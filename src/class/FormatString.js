/**
 *  字符串格式化操作类
 *  @version 0.0.1
 */
class FormatString
{
    constructor() { }

    /** 
     * 区间高亮
     * @param {String} message 消息
     * @param {Array<String>} heighLightChars 高亮的词集
     * @param {String} left 左边包裹字符串
     * @param {String} right 右边包裹字符串
     * @returns {String} 高亮格式的消息
     */
    static delimitationString(message, heighLightChars, left = "[", right = "]")
    {
        if (!Array.isArray(heighLightChars) || heighLightChars.length < 1) return message;

        // 构建正则：按长度降序，避免短词干扰长词
        const sorted = heighLightChars
            .filter(c => typeof c == "string" && c.length > 0)
            .sort((a, b) => b.length - a.length);

        const escaped = sorted.map(c => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        const regex = new RegExp(`(${escaped})`, "g");

        // 替换为高亮格式
        const highlighted = message.replace(regex, `${left}$1${right}`);

        return highlighted;
    }

    /**
     *  比较两个字符串是否相等
     *  @version 0.0.1
     *  @param {String} sa 比较的字符串 A
     *  @param {String} sb 比较的字符串 B
     *  @param {Boolean} [ignoreCase=false] 是否区分大小写
     *  @returns {Boolean}
     */
    static equalString(sa, sb, ignoreCase = false)
    {
        let _sa = sa + "";
        let _sb = sb + "";

        if (ignoreCase) return _sa.toLowerCase().trim() == _sb.toLowerCase().trim();

        return _sa.trim() == _sb.trim();
    }
}

module.exports = FormatString;

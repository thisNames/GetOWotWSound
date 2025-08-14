/**
 *  打印类
 *  @version 0.0.3
 */
class Logger
{
    constructor() { }

    //#region 普通颜色
    /** 统一的样式重置符 白色 */
    static RESET = "\x1b[0m";

    /** 绿色 */
    static GREEN = "\x1b[92m";

    /** 黄色 */
    static YELLOW = "\x1b[33m";

    /** 红色 */
    static RED = "\x1b[31m";

    /** 蓝色 */
    static BLUE = "\x1b[34m";

    /** 紫色 */
    static MAGENTA = "\x1b[35m";

    /** 青色 */
    static CYAN = "\x1b[36m";

    /** 灰色 */
    static GRAY = "\x1b[90m";
    //#endregion

    //#region 高亮颜色
    /** 亮蓝色 */
    static LIGHT_BLUE = "\x1b[94m";

    /** 亮黄色 */
    static LIGHT_YELLOW = "\x1b[93m";
    //#endregion

    /** 工具方法 */
    static log(color, ...args)
    {
        let message = args.join(" ");
        let line = `${color}${message}${Logger.RESET}`;

        console.log(line);

        return Logger;
    }

    /** 
     * 信息
     * @param {...String} args 消息
     * @returns {Logger} this
     */
    static info(...args)
    {
        return Logger.log(Logger.RESET, ...args);
    }

    /** 
     * 成功
     * @param {...String} args 消息
     * @returns {Logger} this
     */
    static success(...args)
    {
        return Logger.log(Logger.GREEN, ...args);
    }

    /** 
     * 警告
     * @param {...String} args 消息
     * @returns {Logger} this
     */
    static warn(...args)
    {
        return Logger.log(Logger.YELLOW, ...args);
    }

    /** 
     * 错误
     * @param {...String} args 消息
     * @returns {Logger} this
     */
    static error(...args)
    {
        return Logger.log(Logger.RED, ...args);
    }

    /** 
     * 提示
     * @param {...String} args 消息
     * @returns {Logger} this
     */
    static prompt(...args)
    {
        return Logger.log(Logger.CYAN, ...args);
    }

    /**
     * 空一行
     * @returns {Logger} this
     */
    static line()
    {
        return Logger.log(Logger.RESET);
    }
}

module.exports = Logger;

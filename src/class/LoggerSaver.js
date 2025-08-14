const Logger = require("./Logger");
const MessageCollect = require("./MessageCollect");
const FormatString = require("./FormatString");

/**
 *  日志保存类
 *  @version 0.0.6
 */
class LoggerSaver extends Logger
{
    /**
     *  @param {String} filename 日志文件名
     *  @param {String} saveFolder 日志文件保存目录
     *  @param {Boolean} isSave 是否保存日志
     */
    constructor(filename, saveFolder, isSave)
    {
        super();

        this.saveFolder = saveFolder || process.cwd();
        this.filename = filename || "default.log";
        this.isSave = isSave;

        /** @type {MessageCollect} 消息收集器 */
        this.__logFile = null;

        // 启用保存日志
        if (this.isSave)
        {
            this.__logFile = new MessageCollect(this.filename, this.saveFolder);
        }
    }

    /** 
     * 关闭日志文件
     * @returns {void}
     */
    close()
    {
        if (this.__logFile)
        {
            this.line().tip(`LoggerSaver [${this.filename}] => ` + this.saveFolder);
            this.__logFile.close();
        }
    }

    /** 
     * 工具方法
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    __log(color, ...args)
    {
        Logger.log(color, ...args);

        // 如果启用保存日志
        if (this.__logFile)
        {
            // 保存日志
            let message = args.join(" ");
            this.__logFile.collect(this.filename, message);
        }

        return this;
    }

    /** 
     * 信息
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    info(...args)
    {
        return this.__log(Logger.RESET, ...args);
    }

    /** 
     * 成功
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    success(...args)
    {
        return this.__log(Logger.GREEN, ...args);
    }

    /** 
     * 警告
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    warn(...args)
    {
        return this.__log(Logger.YELLOW, ...args);
    }

    /** 
     * 错误
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    error(...args)
    {
        return this.__log(Logger.RED, ...args);
    }

    /** 
     * 提示
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    prompt(...args)
    {
        return this.__log(Logger.CYAN, ...args);
    }

    /**
     * 空一行
     * @returns {LoggerSaver} this
     */
    line()
    {
        return this.__log(Logger.RESET);
    }

    /** 
     * 指点
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    tip(...args)
    {
        return this.__log(Logger.LIGHT_BLUE, ...args);
    }

    /** 
     * 高亮
     * @param {...String} args 消息
     * @returns {LoggerSaver} this
     */
    light(...args)
    {
        return this.__log(Logger.LIGHT_YELLOW, ...args);
    }

    /** 
     * 区间高亮
     * @param {String} message 消息
     * @param {Array<String>} heighLightChars 高亮的词集
     * @param {String} heightColor 高亮颜色进制
     * @param {String} color 普通颜色进制
     * @returns {LoggerSaver} this
     */
    heighLight(message, heighLightChars, heightColor = Logger.LIGHT_YELLOW, color = Logger.RESET)
    {
        const highlighted = FormatString.delimitationString(message, heighLightChars, heightColor, color);

        return this.__log(color, highlighted);
    }
}

module.exports = LoggerSaver;

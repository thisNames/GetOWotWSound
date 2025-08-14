const fs = require("node:fs");
const pt = require("node:path");

const Tools = require("./Tools");

/**
 *  日志收集类
 *  @version 0.0.2
 */
class MessageCollect
{
    /**
     * @param {String} path 日志保存路径
     * @param {String} name 日志名称，默认 log
     */
    constructor(name, path = "log")
    {
        this.fr = null;
        this.name = name;
        this.path = path;

        this.__errorCount = 3;

        this.init();
    }

    /**
     *  初始化日志
     *  @param {String} filePath 日志保存路径和名称，可选
     *  @returns {MessageCollect} this
     */
    init(filePath = "")
    {
        if (!fs.existsSync(this.path))
        {
            this.path = fs.mkdirSync(this.path, { recursive: true });
        }

        this.filename = this.name.concat("_", Tools.getDate(), "_", Date.now(), ".log");
        this.filePath = filePath || pt.resolve(this.path, this.filename);

        this.fr = fs.openSync(this.filePath, "a+");

        return this;
    }


    /**
     *  关闭文件
     *  @returns {MessageCollect} this
     */
    close()
    {
        if (this.fr === null) return this;

        fs.closeSync(this.fr);

        this.fr = null;

        return this;
    }

    /**
     * 消息收集
     * @param {String} you 你是谁
     * @param {String} message 要说什么
     * @returns {MessageCollect} this
     */
    collect(you, message)
    {
        if (this.__errorCount < 0) return this.close();

        const m = `[${Tools.getRealTime()}] ${you}: ${message}\r\n`;

        try
        {
            fs.writeSync(this.fr, m, null, "utf8");
        } catch (error)
        {
            this.__errorCount--;

            this.close();
            this.init(this.filePath);
            this.collect(you, message);
        }

        return this;
    }
}

module.exports = MessageCollect;

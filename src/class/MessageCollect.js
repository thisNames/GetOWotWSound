const fs = require("node:fs");
const pt = require("node:path");

const Tools = require("./Tools");

/**
 *  日志收集类
 *  @version 0.0.2
 */
class MessageCollect
{
    /** @type {String} 日志文件 ID */
    static hashID = Tools.generateHashId(8);

    /**
     * @param {String} filename 日志名称
     * @param {String} folder 日志目录
     */
    constructor(filename, folder = "log")
    {
        /** @type {fs.WriteStream} 日志文件写入流 */
        this.fw = null;

        /** @type {String} 日志文件名称 */
        this.filename = filename;

        /** @type {String} 日志文件目录 */
        this.folder = folder;

        /** @type {String} 日志文件路径*/
        this.filePath = "";

        // 初始化日志
        this.init();
    }

    /**
     *  初始化日志
     *  @param {String} filePath 日志保存路径和名称，可选
     *  @returns {MessageCollect} this
     */
    init(filePath = "")
    {
        if (!fs.existsSync(this.folder)) fs.mkdirSync(this.folder, { recursive: true });

        this.filename = this.filename + "_" + MessageCollect.hashID + ".log";
        this.filePath = filePath || pt.resolve(this.folder, this.filename);

        this.fw = fs.createWriteStream(this.filePath, { flags: "w", encoding: "utf-8" });

        return this;
    }


    /**
     *  关闭文件
     *  @returns {MessageCollect} this
     */
    close()
    {
        if (this.fr === null) return this;

        try
        {
            this.fw.close();
        } catch (error) { }

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
        if (this.fw === null) return this;

        const m = you + ": " + message + "\r\n";

        try
        {
            this.fw.write(m);
        } catch (error)
        {
            this.close();
        }

        return this;
    }
}

module.exports = MessageCollect;

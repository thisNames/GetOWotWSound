const fs = require("node:fs");
const pt = require("node:path");

/**
 *  串行日志
 */
class SerialLogger
{
    /**
     *  @param {SerialLogger} option 配置
     */
    constructor(option)
    {
        const {
            folder = process.cwd(),
            filename = "logger",
            maxSize = 50 * 1024 * 1024,
            enRotate = false
        } = option || {};

        /** @type {String} 保存的目录 */
        this.folder = folder;

        /** @type {String} 文件名称 */
        this.filename = filename + ".last.log";

        /** @type {Number} 文件的大小字节 */
        this.maxSize = maxSize;

        /** @type {Boolean} 是否启用日志轮转 */
        this.enRotate = enRotate;


        /** @type {Promise} 串行队列 */
        this.__queue = Promise.resolve();

        /** @type {Number} 文件轮转索引 */
        this.__index = 0;

        /** @type {String} 文件全路径 */
        this.__filePath = "";

        // 初始化日志
        this.__init();
    }

    /**
     *  初始化日志
     *  @returns {void}
     */
    __init()
    {
        // 目录不存在则创建
        if (!fs.existsSync(this.folder)) fs.mkdirSync(this.folder, { recursive: true });

        this.__filePath = pt.join(this.folder, this.filename);
        this.stream = fs.createWriteStream(this.__filePath, { flags: "w" });
    }

    /**
     *  私有：真正写入函数，返回 Promise
     *  @returns {Promise<void>}
     */
    __writeLine(line)
    {
        return new Promise((resolve, reject) =>
        {
            // 先判断是否需要轮转
            if (this.enRotate && this.__shouldRotate()) this._rotate();

            // 写日志
            this.stream.write(line, "utf-8", err => err ? reject(err) : resolve());
        });
    }

    /**
     *  公有接口：保证顺序的 write
     *  @param {String} data 消息
     *  @returns {Promise<void>}
     */
    write(data)
    {
        const line = data + "\r\n";
        // 将本次写入追加到链尾部
        this.__queue = this.__queue.then(() => this.__writeLine(line));

        // 方便外部 await
        return this.__queue;
    }

    /**
     *  私有：轮转判断
     *  @returns {boolean}
     */
    __shouldRotate()
    {
        try
        {
            return fs.statSync(this.__filePath).size > this.maxSize;
        } catch
        {
            return false;
        }
    }

    /**
     *  私有：执行轮转
     *  @returns {void}
     */
    _rotate()
    {
        // 同步关闭旧流
        this.stream.end();
        fs.renameSync(this.__filePath, `${this.__filePath}.${++this.__index}`);
        this.stream = fs.createWriteStream(this.__filePath, { flags: "w" });
    }

    /**
     *  优雅关闭
     *  @returns {Promise<void>}
     */
    async end()
    {
        // 等队列写完
        await this.__queue;
        return new Promise(res => this.stream.end(res));
    }
}

module.exports = SerialLogger;

const MessageCollect = require("./MessageCollect");
const Config = require("../model/Config");
const pt = require("node:path");
const fs = require("node:fs");

/**
 * 运行日志收集没输出类
 */
class RunningLog
{
    /**
     * @param {String} path 日志保存路径
     * @param {String} name 名称
     */
    constructor(name, path)
    {
        this.ext = ".log";

        this.absDirPath = pt.resolve(path, name);

        if (!fs.existsSync(this.absDirPath))
        {
            fs.mkdirSync(this.absDirPath, { recursive: true });
        }

        // 文件名称
        this.successFile = pt.resolve(this.absDirPath, "Success" + this.ext);
        this.failingFile = pt.resolve(this.absDirPath, "Failing" + this.ext);

        this.successDetailFile = pt.resolve(this.absDirPath, "successDetail" + this.ext);
        this.failingDetailFile = pt.resolve(this.absDirPath, "FailingDetail" + this.ext);

        this.runningFile = pt.resolve(this.absDirPath, "Running" + this.ext);

        /**
         * @type {MessageCollect} 成功的默认日志
         */
        this.successLog = new MessageCollect(this.successFile);

        /**
         * @type {MessageCollect} 失败的默认日志
         */
        this.failingLog = new MessageCollect(this.failingFile);

        /**
         * @type {MessageCollect} 成功的详情日志
         */
        this.successDetailLog = new MessageCollect(this.successDetailFile);

        /**
         * @type {MessageCollect} 失败的详情日志
         */
        this.failingDetailLog = new MessageCollect(this.failingDetailFile);

        /**
        * @type {MessageCollect} 程序运行日志
        */
        this.runningLog = new MessageCollect(this.runningFile);

        /**
        * @type {Number} 程序运行的开始时间戳
        */
        this.startTime = Date.now();
    }

    /**
     * 关闭所有文件
     */
    closeFiles()
    {
        this.successLog.close();
        this.failingLog.close();
        this.successDetailLog.close();
        this.failingDetailLog.close();
        this.runningLog.close();
        return this;
    }

    /**
    * 输出
    * @param {String} message 
    */
    printRow(message)
    {
        console.log(message);
        return this;
    }

    /**
     * 保存运行日志
     * @param {String} m 运行日志
     */
    runSave(m)
    {
        const current = Date.now() - this.startTime;
        const message = "".concat(m, " [", current, "ms]");
        this.runningLog.collectLine(message);
        return this;
    }

    /**
     * 一个日志
     * @param {Boolean} logDetail 是否保存详细
     * @param {String} done 成功还是失败
     * @param {String} line 输出一行
     * @param { {cmd: String, buffer: String | Buffer, done: Boolean, target: String, source: String, pid: Number} } value 
     */
    logTask(done, line, value)
    {
        if (done)
        {
            this.successLog.collectLine(line);
            this.successDetailLog.collectDetail(value);
        }
        else
        {
            this.failingLog.collectLine(line);
            this.failingDetailLog.collectDetail(value);
        }
    }

    /**
     * 好吧，就是打印一条线
     * @param {Number} 线的长度
     * @returns {String}
     */
    printLine(n = 30)
    {
        const line = "-".repeat(n);
        console.log(line);
        return line;
    }
}

module.exports = RunningLog;
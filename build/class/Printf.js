const pt = require("node:path");
const fs = require("node:fs");

class Printf
{
    /**
     *  @param {String} logDir 日志输出路径
     *  @param {String} filename 日志文件名称
     */
    constructor(logDir, filename)
    {
        this.logDir = logDir;
        this.filename = filename;

        !fs.existsSync(logDir) && fs.mkdirSync(logDir);

        this.LOG_FILE = fs.openSync(pt.resolve(this.logDir, this.filename), "w");
    }

    /**
     *  打印
     *  @param {String} msg message
     *  @returns {Printf}
     */
    printf(msg)
    {
        msg = "[log]: ".concat(msg);
        fs.writeSync(this.LOG_FILE, msg);
        fs.writeSync(this.LOG_FILE, "\r\n");
        console.log(msg);
        return this;
    }

    /**
     *  关闭
     *  @returns {Printf}
     */
    close()
    {
        try
        {
            fs.closeSync(this.LOG_FILE);
        } catch (error)
        {
            console.error(`[error]: ${error.message}`);
        }
        return this;
    }

    /**
     *  @returns {Printf}
     */
    line()
    {
        this.printf("-".repeat(16));
        return this;
    }

}

module.exports = Printf
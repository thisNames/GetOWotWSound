const fs = require("node:fs");

/**
 *  日志收集类
 */
class MessageCollect
{
    /**
     * @type {Boolean} 是否关闭了
     */
    isClose = false;

    /**
     * @param {String} filePath 文件路径
     */
    constructor(filePath)
    {
        this.filePath = filePath;
        this.fileId = fs.openSync(this.filePath, "w");
    }

    /**
     * close
     */
    close()
    {
        this.isClose = true;
        fs.closeSync(this.fileId);
    }

    /**
     * 消息收集
     * @param {String} message 要说什么
     * @param {Boolean} print 是否输出到控制台
     * @returns {MessageCollect}
     */
    collectLine(message)
    {
        if (this.isClose) return this;
        try
        {
            fs.writeFileSync(this.fileId, message.concat("\r\n"), { encoding: "utf-8" });
            fs.fsyncSync(this.fileId);
        } catch (err)
        {
            const line = "log error: ".concat(err.message);
            console.error(line);
        }
        return this;
    }

    /**
     * 收集详情
     * @param { {cmd: String, buffer: String | Buffer, done: Boolean, target: String, source: String, pid: Number} } value
     */
    collectDetail(value)
    {
        const { cmd = "", buffer = "", done = "", target = "", source = "", pid = 0 } = value;
        const cmdS = this.a_content_line("cmd: ", cmd);
        const doneS = this.a_content_line("buffer: ", buffer && buffer.toString());
        const bufferS = this.a_content_line("done: ", done);
        const targetS = this.a_content_line("target: ", target)
        const sourceS = this.a_content_line("source", source);
        const pidS = this.a_content_line("pid: ", pid);
        const line = "-".repeat(30);

        const m = cmdS.concat(doneS, bufferS, targetS, sourceS, pidS, line);
        return this.collectLine(m, false);
    }

    /**
     * 拼接一行
     * @param {String} a 
     * @param {String} content 
     * @returns 
     */
    a_content_line(a, content)
    {
        return "".concat(a, content, "\r\n");
    }
}

module.exports = MessageCollect;
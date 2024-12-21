const RunOption = require("./RunOption");

/**
 * 子进程运行配置
 */
class ChildProcessRunOption extends RunOption
{
    /** @param {Number} taskScript task 子进程脚本路径 */
    constructor(taskScript)
    {
        super();
        /** @type {String} task 子进程脚本路径 */
        this.taskScript = taskScript;

        /** @type {Number} 子进程的数量（默认 3） */
        this.cMax = 3;

        /** @type {Boolean} 是否使用异步并发（默认 false） */
        this.isAsync = false;
    }
}

module.exports = ChildProcessRunOption;
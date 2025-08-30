/**
 *  子进程执行结果类
 *  @version 0.0.1
 */
class ExecutorResult
{
    /**
     *  @param {ExecutorResult} option 配置项
     */
    constructor(option)
    {
        const {
            exe = "",
            command = "",
            params = [],
            workerSpace = "",
            stdout = "",
            stderr = "",
            errorMessage = "",
            done = false,
            pid = null
        } = option || {};

        /** @type {String} 子进程路径 | 命令的名称 */
        this.exe = exe;

        /** @type {String} 运行的命令字符串 */
        this.command = command;

        /** @type {Array<String>} 子进程执行参数 */
        this.params = params;

        /** @type {String} 子进程的当前工作目录 */
        this.workerSpace = workerSpace;

        /** @type {String | Buffer} 子进程执行的标准输出 */
        this.stdout = stdout;

        /** @type {String | Buffer} 子进程执行的错误输出 */
        this.stderr = stderr;

        /** @type {String} 子进程执行的错误信息 */
        this.errorMessage = errorMessage;

        /** @type {Boolean} 是否执行成功 */
        this.done = done;

        /** @type {Number} 子进程的 pid */
        this.pid = pid;
    }
}

module.exports = ExecutorResult;

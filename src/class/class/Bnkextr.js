const Executor = require("../lib/Executor");

/**
 *  调用 bnkextr.exe 进程
 */
class Bnkextr extends Executor
{
    /**
    * @param {String} exe exe 程序路径
    * @param {String} workSpace exe 程序的工作目录
    */
    constructor(exe, work)
    {
        super(exe, work);
    }

    /**
    * 解压 bnk 文件（异步）
    * @param {String} source .bnk 文件源路径
    * @returns {Promise<{cmd: String, buffer: String, done: Boolean, pid: Number }>}
    * @example
    * 成功的 Promise<参数>
    *   cmd     执行的命令
    *   buffer  执行的输出日志（如果 error，就是 error.message）
    *   done    是否执行成功
    *   pid     执行进程的 pid
    */
    run(source)
    {
        return this.executor(this.a_content_b(source));
    }

    /**
     * 解压 bnk 文件（同步）
     * @param {String} source .bnk 文件源路径
     * @returns {{cmd: String, buffer: Buffer, done: Boolean}}
     * @example
     * 返回参数
     *   cmd     执行的命令
     *   buffer  执行的输出日志（如果 error，就是 null）
     *   done    是否执行成功
     */
    runSync(source)
    {
        return this.executorSync(this.a_content_b(source));
    }
}

module.exports = Bnkextr;
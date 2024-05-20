const Executor = require("../lib/Executor");

/**
 *  调用 ww2ogg.exe 进程
 */
class Ww2ogg extends Executor
{
    /**
    * @param {String} exe exe 程序路径
    * @param {String} packed_codebooks_aoTuV_603 packed_codebooks_aoTuV_603 文件
    * @param {String} workSpace exe 程序的工作目录
    */
    constructor(exe, packed_codebooks_aoTuV_603, work)
    {
        super(exe, work);

        this.exitsAndError(packed_codebooks_aoTuV_603);

        this.packed_codebooks_aoTuV_603 = packed_codebooks_aoTuV_603;
    }

    /**
    * 解码 wem 文件（异步）
    * @param {String} source 源 wem 文件路径
    * @param {String} target ogg 保存路径
    * @returns {Promise<{cmd: String, buffer: String, done: Boolean, pid: Number }>}
    * @example
    * 成功的 Promise<参数>
    *   cmd     执行的命令
    *   buffer  执行的输出日志（如果 error，就是 error.message）
    *   done    是否执行成功
    *   pid     执行进程的 pid
    */
    run(source, target)
    {
        return this.executor(this.a_content_b(source), "-o", this.a_content_b(target), "--pcb", this.a_content_b(this.packed_codebooks_aoTuV_603));
    }

    /**
    * 解码 wem 文件（同步）
    * @param {String} source 源 wem 文件路径
    * @param {String} target ogg 保存路径
    * @returns {{cmd: String, buffer: Buffer, done: Boolean}}
    * @example
    * 返回参数
    *   cmd     执行的命令
    *   buffer  执行的输出日志（如果 error，就是 null）
    *   done    是否执行成功
    */
    runSync(source, target)
    {
        return this.executorSync(this.a_content_b(source), "-o", this.a_content_b(target), "--pcb", this.a_content_b(this.packed_codebooks_aoTuV_603));
    }
}

module.exports = Ww2ogg;
const { execSync, exec } = require("node:child_process");
const fs = require("node:fs");
const pt = require("node:path");

/**
 * 执行类
 */
class Executor
{
    #exe = "";
    #workSpace = "";
    /**
     * @param {String} exe exe 程序路径
     * @param {String} workSpace exe 程序的工作目录
     */
    constructor(exe, workSpace = pt.resolve("./"))
    {
        this.exitsAndError(exe);
        this.exitsAndError(workSpace);

        this.#exe = exe;
        this.#workSpace = workSpace;
    }

    /**
     * 设置程序工作路径
     * @param {String} value 路径
     */
    set WorkSpace(value)
    {
        this.#workSpace = value;
    }

    /**
     * 获取工作路径
     * @returns {String}
     */
    get WorkSpace()
    {
        return this.a_content_b(this.#workSpace);
    }


    /**
     * 获取 exe 程序路径
     * @returns {String}
     */
    getExeProcess()
    {
        return this.a_content_b(this.#exe);
    }

    /**
     * 拼装 cmd 命令
     * @param  {...any} args 参数
     * @returns {String}
     */
    concatCmd(...args)
    {
        let cmd = `cd ${this.WorkSpace} && ${this.getExeProcess()}`;
        args.forEach(c => cmd = cmd.concat(" ", c));
        return cmd
    }

    /**
     * 执行程序（同步）
     * @param  {...any} args 参数
     * @returns {{cmd: String, buffer: Buffer, done: Boolean}}
     * @example
     * 返回参数
     *   cmd     执行的命令
     *   buffer  执行的输出日志（如果 error，就是 null）
     *   done    是否执行成功
     */
    executorSync(...args)
    {
        let cmd = this.concatCmd(...args);
        let res = { cmd, buffer: null, done: false };
        try
        {
            res.buffer = execSync(res.cmd);
            res.done = true;
        }
        catch { }
        finally
        {
            return res;
        }
    }

    /**
    * 执行程序（异步）
    * @param  {...any} args 参数
    * @returns {Promise<{cmd: String, buffer: String, done: Boolean, pid: Number }>}
    * @example
    * 成功的 Promise<参数>
    *   cmd     执行的命令
    *   buffer  执行的输出日志（如果 error，就是 error.message）
    *   done    是否执行成功
    *   pid     执行进程的 pid
    */
    executor(...args)
    {
        return new Promise((resolve, _) =>
        {
            let cmd = this.concatCmd(...args);
            const res = { cmd, buffer: "", done: false, pid: 2024 };
            const p = exec(cmd, (error, stdout) =>
            {
                if (error)
                {
                    res.buffer = error.message;
                    return resolve(res);
                }
                res.buffer = stdout;
                res.done = true;
                resolve(res);
            });
            res.pid = p.pid;
        });
    }

    /**
     * 执行方法（异步）
     * @param  {...any} args 
     * @description abstract
     */
    run(...args)
    {
        throw new Error("this is abstract function");
    }

    /**
    * 执行方法（同步）
    * @param  {...any} args 
    * @description abstract
    */
    runSync(...args)
    {
        throw new Error("this is abstract function");
    }

    /**
     * 路径不存在直接抛出异常
     * @param {String} path 路径
     * @returns {Boolean}
     */
    exitsAndError(path)
    {
        if (fs.existsSync(path))
            return true;

        throw new Error(`path error: ${path || 'tool'} is not found`);
    }

    /**
     * 给字符串添加左右内容包裹
     * @param {String} content 内容
     * @param {String} a 左追加
     * @param {String} b 右追加
     * @returns 
     */
    a_content_b(content, a = "\"", b = "\"")
    {
        return "".concat(a, content, b);
    }
}

module.exports = Executor;

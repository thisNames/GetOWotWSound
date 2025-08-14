const cp = require("node:child_process");

const ExecutorResult = require("./ExecutorResult");

/**
 * 执行类
 * @version 0.0.1
 */
class Executor
{
    /**
     * @param {Executor} option 配置项 
     */
    constructor(option)
    {
        const {
            exe = "",
            workerSpace = process.cwd(),
            params = []

        } = option || {};

        /** @type {String} 子进程路径 | 命令的名称 */
        this.exe = exe;

        /** @type {String} 子进程的当前工作目录 */
        this.workerSpace = workerSpace;

        /** @type {Array<String>} 子进程的执行参数 */
        this.params = params;
    }

    /**
    *  获取自己的配置
    *  @returns {Object}
    */
    __getOption()
    {
        return {
            exe: this.exe,
            params: this.params,
            command: this.__command,
            workerSpace: this.workerSpace
        };
    }

    /**
     *  获取运行时的配置项
     *  @returns {Object}
     */
    __getExeOption()
    {
        return {
            cwd: this.workerSpace
        };
    }

    /**
     *  获取运行程序的字符串
     *  @returns {String}
     */
    __formatParams()
    {
        const hasSpace = /\s/;
        const __params = [this.exe, ...this.params];

        return __params.map(p => hasSpace.test(p) ? this.a_content_b(p) : p).join(" ");
    }

    /**
     *  为子进程添加多个个运行参数
     *  @param {...String} args 参数
     *  @returns {Executor} this
     */
    addParams(...args)
    {
        this.params.push(...args);
        return this;
    }

    /**
     *  为子进程添加一个运行参数
     *  @param {...String} args 参数
     *  @returns {Executor} this
     */
    addParam(param)
    {
        this.params.push(param);
        return this;
    }

    /**
     * 执行程序（同步）
     * @returns {ExecutorResult}
     */
    executorSync()
    {
        const ert = new ExecutorResult(this.__getOption());

        try
        {
            ert.command = this.__formatParams();
            const stdout = cp.execSync(ert.command, this.__getExeOption());

            ert.done = true;
            ert.stdout = stdout.toString();
        } catch (error)
        {
            ert.done = false;
            ert.errorMessage = `Sync: ${this.exe} => ${error.message || "sync executor error"}`;
        }

        return ert;
    }

    /**
    * 执行程序（异步）
    * @returns {Promise<ExecutorResult>}
    */
    executor()
    {
        const ert = new ExecutorResult(this.__getOption());

        return new Promise((res, rej) =>
        {
            ert.command = this.__formatParams();
            const p = cp.exec(ert.command, this.__getExeOption(), (error, stdout, stderr) =>
            {
                if (error)
                {
                    ert.errorMessage = `Async: ${this.exe} => ${error.message || "async executor error"}`;
                    ert.stderr = stderr;
                }

                ert.done = !error;
                ert.stdout = stdout;

                res(ert);
            });

            ert.pid = p.pid;
        });
    }

    /**
     * 给字符串添加左右内容包裹
     * @param {String} content 内容
     * @param {String} a 左追加
     * @param {String} b 右追加
     * @returns {String}
     */
    a_content_b(content, a = "\"", b = "\"")
    {
        return "".concat(a, content, b);
    }
}

module.exports = Executor;

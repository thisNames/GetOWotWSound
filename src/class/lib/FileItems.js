const Config = require("../option/Config");

const Ww2ogg = require("../class/Ww2ogg");
const Revorb = require("../class/Revorb");
const Bnkextr = require("../class/Bnkextr");

const fs = require("node:fs");
const pt = require("node:path");

/**
 * 统一处理的类
 */
class FileItem
{
    /**@type {Ww2ogg}   ww2ogg.exe */
    ww2ogg = null;

    /**@type {Revorb}   revorb.exe */
    revorb = null;

    /**@type {Bnkextr}  bnkextr.exe */
    bnkextr = null;

    /**
    * @param {Config} config 配置
    */
    constructor(config)
    {
        this.config = config;

        /**
        * 会在 buildSync 中自动添加执行 成功 的实例
        * @type {Array< {source: String, target: String, done: Boolean, buffer: Buffer, cmd: String} >}
        */
        this.buildSyncScAudioItems = [];

        /**
         * 会在 buildSync 中自动添加执行 失败 的实例
        * @type {Array< {source: String, target: String, done: Boolean, buffer: Buffer, cmd: String} >}
        */
        this.buildSyncFaAudioItems = [];
    }

    /**
    * 设置工具（必须先调用）（只是为了让构造函数不要传那么多形参）
    * @param {Ww2ogg}  ww2ogg   ww2ogg.exe
    * @param {Revorb}  revorb   revorb.exe
    * @param {Bnkextr} bnkextr  bnkextr.exe
    */
    setTools(ww2ogg, revorb, bnkextr)
    {
        this.ww2ogg = ww2ogg;
        this.revorb = revorb;
        this.bnkextr = bnkextr;
    }

    /**
    * 链接目录（核心）
    * @param {String} dirPath
    */
    linkPath(dirPath)
    {
        if (fs.existsSync(dirPath))
            return dirPath;
        else
        {
            fs.mkdirSync(dirPath, { recursive: true });
            return dirPath;
        }
    }

    /**
    * 生成 source 和 target（主要路径来源方法）
    * @param {String} source 源
    * @param {AudioItem} audioItem 源
    * @returns {{source: String, target: String}}
    * @description abstract function
    * @example
    * returns 参数：
    *  source      源路径（Ori）
    *  target      目标路径（Seri）
    */
    installOriAndSeri(audioItem, source)
    {
        let targetDir = null;
        if (this.config.id)
        {
            // const idBfName = audioItem.Id.concat("_", audioItem.baseShortName());
            const idBfName = audioItem.FID.concat("_", audioItem.baseShortName());
            targetDir = audioItem.appendExtName(pt.join(audioItem.getShortNameToTypeName(), idBfName));
        } else
        {
            targetDir = audioItem.appendExtName(audioItem.ShortName);
        }

        let target = pt.resolve(this.config.buildPath, targetDir);
        if (this.config.newType)
        {
            const t = pt.resolve(this.config.buildPath, audioItem.getShortNameToTypeName());
            // 创建链接（获取）
            this.linkPath(t);
        }
        else
        {
            target = pt.resolve(this.config.buildPath, pt.basename(target));
        }

        return { source, target }
    }

    /**
    * 修复一个 .ogg 文件（异步）
    * @param {String}   source  .ogg 文件路径
    * @param {Function} task    回调，执行
    * @example 
    * task
    *   回调，每一次异步执行时调用
    *   形参：Promise<Object>
    *      cmd         执行的命令
    *      buffer      输出的日志 String（失败则为 error.message）
    *      done        成功为 true
    *      pid         进程的 pid
    * 
    *   返回值：
    *      无
    */
    fixOgg(source)
    {
        return this.revorb.run(source);
    }

    /**
    * 修复一个 .ogg 文件（同步）
    * @param {String}   source  .ogg 文件路径
    * @param {Function} task    回调，执行
    * @example 
    * task
    *   回调，每一次异步执行时调用
    *   形参：Object
    *      cmd         执行的命令
    *      buffer      执行的输出日志 Buffer（如果 error，就是 null）
    *      done        成功为 true
    *   返回值：
    *      无
    */
    fixOggSync(source, task)
    {
        const o = this.revorb.runSync(source);
        task(o);
    }

    /**
    * 修复所有 .ogg 文件（异步）
    * @param {{next: Function task: Function, complete: Function}} events 回调对象
    * @description 此方法会一次性开启所有的异步任务，会导致 cpu 100%，磁盘 100%
    * @deprecated 请使用 fixOriOggAndPromise，可控的开启异步任务
    * @example 
    * next
    *   回调，开启每一次异步时调用
    *   形参：Object
    *      cmd         执行的命令
    *      buffer      执行的输出日志 Buffer（如果 error，就是 null）
    *      done        成功时为 true
    *      source      源路径
    *      target      目标路径
    *   返回值：
    *       如果为 false，直接结束异步任务继续开启
    * ------------------------------------------------------------
    * task
    *   回调，每一次异步执行时调用
    *   形参：Object
    *      cmd         执行的命令
    *      buffer      执行的输出日志 String（如果 error，就是 error.message）
    *      done        成功时为 true
    *      pid         进程的 pid
    *      source      源路径
    *      target      目标路径
    *   返回值：
    *      无
    * ------------------------------------------------------------
    * complete
    *   回调，所有的异步任务 + task 回调都执行完成
    *   形参：Number
    *     index      完成执行的数量
    *  返回值：
    *      无
    */
    fixOriOgg(events = {})
    {
        const { next = null, task = null, complete = null } = events;
        let index = 0;
        for (let i = 0; i < this.buildSyncScAudioItems.length; i++)
        {
            const ogg = this.buildSyncScAudioItems[i];

            this.revorb.run(ogg.target).then(value =>
            {
                typeof task === "function" && task({ ...ogg, ...value });

                // 我滴任务完成啦（啊哈哈哈~）
                typeof complete === "function" && ++index >= this.buildSyncScAudioItems.length && complete(index);
            });

            if (typeof next != "function") continue;
            // 在开启 Promise 队列之前
            if (!next(ogg))
            {
                // 我滴任务完成啦（啊哈哈哈~）
                typeof complete === "function" && complete(i + 1);
                break;
            }
        }
    }

    /**
    * 修复所有 .ogg 文件（同步）
    * @param {next: Function}} next 回调，每日一次执行
    * @example 
    * next
    *   回调，每一次执行时调用
    *   形参：Object
    *      cmd         执行的命令
    *      buffer      执行的输出日志 String（如果 error，就是 error.message）
    *      done        成功时为 true
    *      source      源路径
    *      target      目标路径
    *   返回值：
    *      如果为 false，直接结束异步任务继续开启
    */
    fixOriOggSync(next)
    {
        for (let i = 0; i < this.buildSyncScAudioItems.length; i++)
        {
            const ogg = this.buildSyncScAudioItems[i];

            const o = this.revorb.runSync(ogg.target);

            if (typeof next != "function") continue;
            if (!next({ ...ogg, ...o }))
                break;
        }
    }

    /**
    * 修复所有 .ogg 文件（同步）
    * @param {{next: Function taskList: Function}} events 回调对象
    * @param {Number} maxTasksCount 一次最大并发的数量
    * @returns  {Promise<Number>} 执行的数量
    * @example
    * next
    *  回调 下一次开启任务前调用，是否允许继续开启任务
    *  Object
    *      source      源路径
    *      target      目标路径
    *  返回值：
    *      如果为 false，直接结束任务继续开启
    * ------------------------------------------------------------
    * taskList
    *  回调，每一次异步执行时调用
    *  形参：Array<Object>
    *      cmd         执行的命令
    *      buffer      执行的输出日志 String（如果 error，就是 error.message）
    *      done        成功时为 true
    *      pid         进程的 pid
    *      source      源路径
    *      target      目标路径
    *  返回值：
    *      无
    */
    async fixOriOggAndPromise(maxTasksCount = 5, events = {})
    {
        let complete = 0;
        let tasks = [];

        const { next = null, taskList = null } = events;

        async function sendTaskList()
        {
            const oriList = await Promise.all(tasks);
            complete += tasks.length;
            typeof taskList === "function" && taskList(oriList);
            tasks = [];
        }

        for (let i = 0; i < this.buildSyncScAudioItems.length; i++)
        {
            const ogg = this.buildSyncScAudioItems[i];

            const task = this.revorb.run(ogg.target).then(value => ({ ...ogg, ...value }));
            tasks.push(task);

            if (tasks.length >= maxTasksCount)
                await sendTaskList();

            if (typeof next != "function") continue;
            // 在开启 Promise 队列之前
            if (!next(ogg))
            {
                await sendTaskList();;
                break;
            }
        }

        if (tasks.length > 0)
            await sendTaskList();

        return complete;
    }

    /**
    * 生成文件（同步）
    * @param {Function} next 回调，每一次执行
    * @description  abstract function
    */
    buildSync(next)
    {
        throw new Error("this is abstract function");
    }

    /**
    * 生成文件（异步）
    * @param {{next: Function task: Function, complete: Function}} events 回调对象
    * @description  abstract function
    */
    build(events = {})
    {
        throw new Error("this is abstract function");
    }
}

module.exports = FileItem;

const Config = require("../option/Config");
const AudioItem = require("../model/AudioItem");

const FileItem = require("../lib/FileItems");

const pt = require("node:path");

/**
 * 处理一个 ReferencedStreamedFiles 节点
 * 实例需要调用 setTools
 */
class ReferencedStreamedFile extends FileItem
{
    /**
     * @param {Config} config 配置
     * @param {Object} referencedStreamedFilesNode ReferencedStreamedFiles 节点
     */
    constructor(config, referencedStreamedFilesNodes)
    {
        super(config);
        this.nodes = referencedStreamedFilesNodes;
    }

    /**
     * 生成文件（同步）
     * @param {Function} next 回调，每一次执行
     * @example
     * next 
     *  回调，每一次执行
     *  形参：Object
     *      cmd         执行的命令
     *      buffer      执行的输出日志 Buffer（如果 error，就是 null）
     *      done        成功时为 true
     *      source      源路径
     *      target      目标路径
     * 
     * next 返回值：
     *      如果为 false，则直接结束循环
     */
    buildSync(next)
    {
        for (let i = 0; i < this.nodes.length; i++)
        {
            const node = this.nodes[i];
            const audioItem = new AudioItem(node.Id, node.Language, node.ShortName, node.Path);
            const ori1 = this.installOriAndSeri(audioItem, pt.resolve(this.config.soundAssetsPath, audioItem.getIdForName()));

            const res = this.ww2ogg.runSync(ori1.source, ori1.target); // 耗时任务

            const save = { ...res, ...ori1 };

            res.done ? this.buildSyncScAudioItems.push(save) : this.buildSyncFaAudioItems.push(save);

            if (typeof next != "function") continue;

            if (!next(save))
                break;
        }
    }

    /**
     * 生成文件（异步）
     * @param {{next: Function task: Function, complete: Function}} events 回调对象
     * @description 此方法会一次性开启所有的异步任务，会导致 cpu 100%，磁盘 100%
     * @deprecated 请使用 buildAndPromise，可控的开启异步任务
     * @example
     * next
     *  回调，开启每一次异步时调用
     *  Object
     *      source      源路径
     *      target      目标路径
     *  返回值：
     *      如果为 false，直接结束异步任务继续开启
     * ------------------------------------------------------------
     * task
     *  回调，每一次异步执行时调用
     *  形参：Object
     *      cmd         执行的命令
     *      buffer      执行的输出日志 String（如果 error，就是 error.message）
     *      done        成功时为 true
     *      pid         进程的 pid
     *      source      源路径
     *      target      目标路径
     *  返回值：
     *      无
     * ------------------------------------------------------------
     * complete
     *  回调，所有的异步任务 + task 回调都执行完成
     *  形参：Number
     *      index      完成执行的数量
     *  返回值：
     *      无
     */
    build(events = {})
    {
        const { next = null, task = null, complete = null } = events;
        let index = 0;
        for (let i = 0; i < this.nodes.length; i++)
        {
            const node = this.nodes[i];
            const audioItem = new AudioItem(node.Id, node.Language, node.ShortName, node.Path);
            const ori2 = this.installOriAndSeri(audioItem, pt.resolve(this.config.soundAssetsPath, audioItem.getIdForName()));

            this.ww2ogg.run(ori2.source, ori2.target).then(value =>
            {
                typeof task === "function" && task({ ...value, ...ori2 });

                // 我滴任务完成啦（啊哈哈哈~）
                ++index === this.nodes.length && typeof complete === "function" && complete(index);
            });

            if (typeof next != "function") continue;
            // 在开启 Promise 队列之前
            if (!next(ori2))
            {
                typeof complete === "function" && complete(i + 1);
                break;
            }
        }
    }

    /**
    * 生成文件（异步）
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
    async buildAndPromise(maxTasksCount = 5, events = {})
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

        for (let i = 0; i < this.nodes.length; i++)
        {
            const node = this.nodes[i];
            const audioItem = new AudioItem(node.Id, node.Language, node.ShortName, node.Path);
            const ori2 = this.installOriAndSeri(audioItem, pt.resolve(this.config.soundAssetsPath, audioItem.getIdForName()));

            const task = this.ww2ogg.run(ori2.source, ori2.target).then(value => ({ ...value, ...ori2 }));

            tasks.push(task);

            if (tasks.length >= maxTasksCount)
                await sendTaskList();

            if (typeof next != "function") continue;
            // 在开启 Promise 队列之前
            if (!next(ori2))
            {
                await sendTaskList();
                break;
            }
        }

        if (tasks.length > 0)
            await sendTaskList();

        return complete;
    }
}

module.exports = ReferencedStreamedFile;
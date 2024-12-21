const { fork, ChildProcess } = require("node:child_process");

/**
 *  进程集合类
 *  @description 限制 ProcessSet 每个实例的每个子进程，一次只能执行一个任务
*/
class ProcessSet
{
    #isRun = false;

    /** @type {Array<ChildProcess>} */
    psList = [];

    /**
    * @param {Number} cMax 进程的数量
    * @param {String} worker 子进程 js 文件 
    */
    constructor(cMax, worker)
    {
        this.cMax = cMax;
        this.worker = worker;

        /** @type {Array<Object>} taskList 要执行的任务（数据）*/
        this.taskList = [];
    }

    /**
    * 启动所有的子进程
    * @param {Function} next 回调
    * @example
    * next
    *  启动一个进程调用一次
    *  参数：pid
    */
    initProcess(next)
    {
        for (let i = 0; i < this.cMax; i++)
        {
            const cp = fork(this.worker);
            this.psList.push(cp);
            typeof next === "function" && next(cp.pid);
        }
    }

    /**
    * 销毁所有子进程
    * @returns {Array<{done: Boolean, pid: Number}>} 终止子进程的结果集
    */
    kills()
    {
        const res = [];
        this.psList.forEach(cp => res.push({ pid: cp.pid, done: cp.kill() }));
        return res;
    }

    /**
    * 开始运行（异步/异步）
    * @param {{ complete: Function, next: Function }} callbacks
    * @param {Boolean} isAsync 是否使用异步并发（默认 false）
    * @returns {Promise<Number>} 执行了任务的数量；如果还在执行则返回 -1
    * @example
    * complete: Function
    *  完成一次任务时调用
    *  参数：完成的结果
    * 
    * next: Function
    *  下一次任务开启之前调用。
    *  也就是说在上一个任务开启后，是否继续开启下一个任务
    *  参数：当前已经执行的任务数量（索引）
    */
    async running(callbacks, isAsync = false)
    {
        if (this.#isRun)
            return -1;

        this.#isRun = true;

        if (isAsync)
            return await this.#run(callbacks).then(v =>
            {
                this.#isRun = false;
                return v;
            });
        else
            return await this.#runSync(callbacks).then(v =>
            {
                this.#isRun = false;
                return v;
            });
    }

    /**
    * 同步并发
    * @param {{ complete: Function, next: Function }} callbacks
    * @example
    * complete: Function
    *  完成一次任务时调用
    *  参数：完成的结果
    * 
    * next: Function
    *  下一次任务开启之前调用。
    *  也就是说在上一个任务开启后，是否继续开启下一个任务
    *  参数：
    *       当前已经执行的任务数量（索引）
    *       执行此任务子进程的 pid
    */
    async #runSync(callbacks)
    {
        let count = 0;
        if (this.taskList.length < 1) return count;

        const { complete, next } = callbacks;
        let tasks = [];

        async function result()
        {
            const results = await Promise.all(tasks);
            count += tasks.length;
            tasks = [];
            typeof next === "function" && results.forEach(t => complete(t));
        }

        for (let i = 0; i < this.taskList.length; i++)
        {

            const index = i % this.cMax;
            const ps = this.psList[index];
            const task = new Promise(res => ps.once("message", res));
            ps.send(this.taskList[i]);
            tasks.push(task);

            if (typeof next === "function" && !next(i, ps.pid))
            {
                await result();
                break;
            }

            tasks.length === this.psList.length && await result();
        }

        tasks.length > 0 && await result();
        return count;
    }

    /**
    * 异步并发
    * @param {{ complete: Function, next: Function }} callbacks
    * @example
    * complete: Function
    *  完成一次任务时调用
    *  参数：完成的结果
    * 
    * next: Function
    *  下一次任务开启之前调用。
    *  也就是说在上一个任务开启后，是否继续开启下一个任务
    *  参数：
    *       当前已经执行的任务数量（索引）id
    *       执行此任务子进程的 pid
    */
    async #run(callbacks)
    {
        let count = 0;
        if (this.taskList.length < 1) return count;

        const { complete, next } = callbacks;
        let tasks = new Array(this.cMax);
        tasks.fill(null);

        async function results()
        {
            // 直接等待剩余所有的任务完成
            const res = await Promise.all(tasks.filter(t => t != null));
            tasks.fill(null);
            typeof next === "function" && res.forEach(i => complete(i.data));
        }

        for (let i = 0; i < this.taskList.length; i++)
        {
            count++;
            const index = tasks.indexOf(null);

            const ps = this.psList[index];
            const task = new Promise(res => ps.once("message", data => res({ index, data })));
            ps.send(this.taskList[i]);

            tasks[index] = task;

            // 中途取消
            if (typeof next === "function" && !next(i, ps.pid))
            {
                await results();
                return count;
            }

            // 队列已经满员
            if (!tasks.includes(null))
            {
                // 将首个完成任务的子进程，从队列中移除（通过自己的座位号）
                const { index, data } = await Promise.race(tasks);
                tasks[index] = null;
                complete(data);
            }
        }

        // cMax > task count
        this.psList.length > this.taskList.length && tasks.includes(null) && await results();
        return count;
    }
}

module.exports = ProcessSet;
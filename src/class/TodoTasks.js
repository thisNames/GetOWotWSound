const Params = require('./Params.js');
const MainRunningMeta = require('./MainRunningMeta.js');

/**
 *  待执行的任务事项
 *  @version 0.0.1
 */
class TodoTasks
{
    constructor()
    {
        /** @type {Array<{pm: Params, meta: MainRunningMeta}>} 带执行的任务队列 */
        this.__tasks = [];
    }

    /**
     *  添加一个待执行的任务
     *  @param {Params} pm Params 命令对象
     *  @param {MainRunningMeta} meta 其他参数
     *  @returns {TodoTasks} this
     */
    addTodoTask(pm, meta)
    {
        this.__tasks.push({
            pm: pm,
            meta: meta
        });

        return this;
    }

    /**
     *  排序任务，优先执行 level 最大的任务
     *  @returns {TodoTasks} this
     */
    sort()
    {
        this.__tasks = this.__tasks.sort((pm1, pm2) => pm2.pm.__level - pm1.pm.__level);

        return this;
    }

    /**
     *  开始执行任务
     *  @returns {Number} 执行了任务的总数
     */
    running()
    {
        // 运行任务
        for (let i = 0; i < this.__tasks.length; i++)
        {
            const task = this.__tasks[i];
            task.pm.__index = i;

            // 运行主任务
            task.pm.running(task.meta);

            // 当前的任务完成之后的事件调用
            task.pm.afterRunning(task.meta);
        }

        return this.__tasks.length;
    }

    /**
     *  所有的任务执行完成之后，调用结束事件
     *  @returns {Number} 调用结束事件的数量
     */
    allAfterRunning()
    {
        // 所有的任务完成之后的事件调用
        for (let i = 0; i < this.__tasks.length; i++)
        {
            const task = this.__tasks[i];

            task.pm.allAfterRunning(task.meta);
        }

        return this.__tasks.length;
    }
}

module.exports = TodoTasks;

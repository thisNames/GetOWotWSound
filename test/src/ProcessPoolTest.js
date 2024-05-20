const { fork, ChildProcess } = require("child_process");

class ProcessStatus
{

    /**
     * @type {'RUN_END' | 'RUNNING' | 'EXIT'}
     */
    status = "RUN_END";

    /**
     * @param {Number} pid pid
     * @param {Boolean} isRun 是否处于运行状态
     * @param {Number} id id 唯一
     * @param {String} name name
     */
    constructor(pid, isRun, id, name)
    {
        this.pid = pid;
        this.isRun = isRun;
        this.id = id;
        this.name = name;
    }

    /**
     * 状态字符串
     * @returns {String}
     */
    toString()
    {
        return "@id".concat(this.id, " >> ", this.name, " >> ", this.pid, " >> ", this.status);
    }
}

class ProcessInstall extends ProcessStatus
{
    /**
     * @param {ChildProcess} process 进程
     */
    constructor(pid, isRun, id, name, process)
    {
        super(pid, isRun, id, name);
        this.isRun = 10;
        this.process = process;
        this.initListener();
    }

    initListener()
    {
        this.process.on("message", data =>
        {

        });
    }

    /**
     * 执行任务
     * @param {Object} data 序列化数据
     * @param {Function} complete process.send 回调
     * @returns {Boolean}
     */
    runTask(data, complete)
    {
        this.isRun = true;
        return this.process.send(data, complete);
    }

    endRun()
    {
        this.isRun = false;
    }

    switchStatus(status)
    {
        console.log(status);
        this.status = status;
    }
}

class ProcessPool
{
    /**
     * @type {Array<ProcessInstall>}
     */
    processPools = [];

    /**
     * @param {Number} max Process max count
     * @param {String} worker js filepath
     */
    constructor(max, worker)
    {
        this.max = max;
        this.worker = worker;
    }

    // init process to pool
    initProcess(isRun = false)
    {
        for (let i = 0; i < this.max; i++)
        {
            const childProcess = fork(this.worker);
            this.processPools.push(new ProcessInstall(
                childProcess.pid,
                isRun,
                i,
                "child_p" + i,
                childProcess
            ));
        }
    }

    /**
     * 获取一个进程的状态
     * @param {Number} pid_id pid or id
     * @returns {ProcessStatus}
     */
    getProcessStatus(pid_id)
    {
        const childProcess = this.findProcess(pid_id);
        if (childProcess === undefined) return;
        const ps = new ProcessStatus(childProcess.id, childProcess.isRun, childProcess.pid, childProcess.name);
        ps.status = childProcess.status;
        return ps;
    }

    /**
    * 从进程池中获取一个进程实例
    * @param {Number} pid_id pid or id
    * @returns {ProcessInstall}
    */
    findProcess(pid_id)
    {
        return this.processPools.find(p => p.pid === pid_id || p.id === pid_id);
    }
}

// let max = 5;
// const pm = new ProcessPool(max, "./1.js");
// console.log(pm.processPools.length);
// pm.initProcess();

// const st = Date.now();
// process.on("exit", () =>
// {
//     console.log(Date.now() - st + "ms exit");
// })

// 同步并发（任务执行的时间都差不多的使用）
// 处理时间 = 每次并发，用时最长任务，所使用的时间 累加
// 执行次数 = （任务总数量 / 最大并发数量）Math.ceil(22 / 5) = 5
async function run1()
{
    async function runEnd(tasks = [])
    {
        const taskList = await Promise.all(tasks);
        console.log(taskList);
        return taskList;
    }

    console.log(process.pid);
    let tasks = [];
    let current = 0;
    console.log(`----------${current}---------`);
    for (let i = 0; i < 23; i++)
    {
        const index = i % 5;
        const prm = new Promise(res => pm.processPools[index].process.once("message", res));
        pm.processPools[index].process.send({ id: index, data: i, ppid: process.pid });
        tasks.push(prm);

        if (tasks.length >= 5)
        {
            await runEnd(tasks);
            current++;
            console.log(`----------${current}---------`);
            tasks = [];
        }
    }

    await runEnd(tasks);
    tasks = [];
}
// run1().then(v =>
// {
//     pm.processPools.forEach(p => p.process.kill());
// }); // 5102ms exit


// 异步并发（任务的执行时常随机）
// 处理时间 = ?
// 执行次数 = 任务总数量 - 最大并发数量
async function run2()
{
    let tasks = new Array(5);
    tasks.fill(null);
    let current = 0;
    console.log(`----------${current}---------`);
    for (let i = 0; i < 23; i++)
    {
        const index = tasks.indexOf(null);

        pm.processPools[index].process.send({ id: index, data: i });
        const prm = new Promise(res => pm.processPools[index].process.once("message", res));

        tasks[index] = prm;

        if (!tasks.includes(null))
        {
            current++;
            const first = await Promise.race(tasks);
            console.log(`----------${current}---------`);
            console.log(first);
            console.log(tasks[first]);
            tasks[first] = null;
            console.log(tasks);
        }
    }
}

// run2().then(v =>
// {
//     pm.processPools.forEach(p => p.process.kill());
// }); // 4094ms

async function move(move)
{
    // let op = [">", "ori", ">", "ori", ">", "ori"];
    // let op = [0, 1, 2, 3, 4, 5];
    let op = ["<", "ori", "<", "ori", "<", "ori"];

    console.log(op);

    for (let j = 0; j < move; j++)
    {
        // for (let i = (op.length - 1); i > 0; i--)
        // {
        //     const index = i % op.length - 1;

        //     let temp = op[index];
        //     op[index] = op[i];
        //     op[i] = temp;

        // }

        for (let i = 1; i < op.length; i++)
        {
            const index = i % op.length - 1;

            let temp = op[index];
            op[index] = op[i];
            op[i] = temp;

        }


        await new Promise(res =>
        {
            setTimeout(() =>
            {
                console.clear();
                res();
            }, 200)
        })

        console.log("---------------------");
        console.log(op);
        console.log("---------------------");
    }

}
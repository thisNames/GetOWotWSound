const { fork, ChildProcess } = require("node:child_process");

const st = Date.now();
process.once("exit", () =>
{
    console.log(Date.now() - st + "ms exit");
});

/**
 * @type {Array<ChildProcess>}
 */
const psList = [];

/**
 * 同步并发
 * @param {{ completes: Function, next: Function }}
 * @example 
 * completes: Function
 *  每次并发完成时调用
 *  参数：完成的结果集
 * 
 * next: Function
 *  下一次任务开启之前调用。
 *  也就是说在上一个任务开启后，是否继续开启下一个任务
 *  参数：当前已经执行的任务数量（索引）
 */
async function runSync(options)
{
    if (taskLength < 1) throw new Error("task min is 1");

    const { complete, next } = options;
    let tasks = [];
    let count = 0;

    async function result()
    {
        const results = await Promise.all(tasks);
        count += tasks.length;
        complete(results);
        tasks = [];
    }

    for (let i = 0; i < taskLength; i++)
    {

        const index = i % cMax;
        const ps = psList[index];
        const task = new Promise(res => ps.once("message", res));
        ps.send(i);
        tasks.push(task);

        if (!next(i))
        {
            await result();
            break;
        }

        tasks.length === cMax && await result();
    }

    tasks.length > 0 && await result();

    return count;
}

/**
 * 异步并发
 * @param {{ completes: Function, next: Function }}
 * @example
 * completes: Function
 *  每次并发完成时调用
 *  参数：完成的结果集
 * 
 * next: Function
 *  下一次任务开启之前调用。
 *  也就是说在上一个任务开启后，是否继续开启下一个任务
 *  参数：当前已经执行的任务数量（索引）
 */
async function run(options)
{

    if (taskLength < 1) throw new Error("task min is 1");

    const { complete, next } = options;
    let count = 0;

    let tasks = new Array(cMax);
    tasks.fill(null);

    async function results()
    {
        // 直接等待剩余所有的任务完成
        const res = await Promise.all(tasks.filter(t => t != null));
        res.forEach(i => complete(i.data));
    }

    for (let i = 0; i < taskLength; i++)
    {
        count++;
        const index = tasks.indexOf(null);

        const ps = psList[index];
        const task = new Promise(res => ps.once("message", data => res({ index, data })));
        ps.send(i);

        tasks[index] = task;

        // 中途取消
        if (!next(i))
        {
            await results();
            return count;
        }

        // 队列已经满员
        if (!tasks.includes(null))
        {
            // 将收个完成任务，从队列中移除（通过自己的座位号）
            const { index, data } = await Promise.race(tasks);
            tasks[index] = null;
            complete(data);
        }
    }

    // cMax > task count
    cMax > taskLength && tasks.includes(null) && await results();

    return count;
}

// 子进程的数量，也是最大并发的数量
const cMax = 5;
// 模拟任务的数量 
const taskLength = 100;

// 先启动所有的子进程
function initProcess()
{
    for (let i = 0; i < cMax; i++) { psList.push(fork("src/TaskTest.js")) }
}
initProcess();

let test = 1000;
const options = {
    next(tk)
    {
        console.log("next:", tk);
        return --test > 0;
    },
    complete(result)
    {
        console.log("complete:", result);
    }
}

// 100 task(1000ms) 5 process time is 20386 ms
// 100 task(1500ms ~ 500ms) 5 process time is（测试次数3：26977、26345ms、26595 ）ms
runSync(options).then(v =>
{
    psList.forEach(ps => ps.kill());
    console.log("sync count:", v);
});

// 100 task(1000ms) 5 process time is 20365ms ms
// 100 task(1500ms ~ 500ms) 5 process time is（测试次数3：20403、20154、20328）ms
run(options).then(v =>
{
    psList.forEach(ps => ps.kill());
    console.log("count:", v);
});

/**
 * 如果每个任务执行所需消耗的时间，相差不是很大。那么使用同步还是异步，并发执行的速度都差不多。
 *
 * 如果每个任务执行所需消耗的时间，相差都很大，都不一样。那么使用，异步并发执行的速度要快一些。
 */

// task.js
// const rTime = (max, min) => Math.ceil(Math.random() * (max - min) + min + 1);
// function task(data) {
//     const t = rTime(1500, 500);
//     // const t = 1000;
//     const startLine = `${process.pid} start task: ${data} in time ${t} ms`;
//     console.log(startLine);
//     const line = `${process.pid} run task: ${data}, out time ${t}ms`
//     setTimeout(() => {
//         console.log(line);
//         console.log("-----------");
//         process.send("OK " + process.pid);
//     }, t);
// }
// process.on("message", task);
// -----
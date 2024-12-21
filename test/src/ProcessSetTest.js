const namespace = require("../../src/class");

const st = Date.now();
process.once("exit", () => console.log(Date.now() - st + "ms exit"));

/**
 * 如果每个任务执行所需消耗的时间，相差不是很大。那么使用同步还是异步，并发执行的速度都差不多。
 *
 * 如果每个任务执行所需消耗的时间，相差都很大，都不一样。那么使用，异步并发执行的速度要快一些。
 */

const ps = new namespace.ProcessSet(3, "./src/BnkTaskTest.js");

ps.initProcess(function (pid)
{
    const line = `@cp: ${pid} init`;
    console.log(line);
});

console.log("------------------------");

// 任务
const testTask = 13;
// ps.taskList = new Array(testTask).fill(0).map((t, i) => i);
ps.taskList = namespace.SoundbanksInfoJson.SoundBanksInfo.SoundBanks;

const callbacks = {
    complete(value)
    {
        console.log("complete:", value);
    },
    next(value)
    {
        console.log("next:", value);
        return true;
    }
}

// 测试为 100 个耗时任务，每个任务平均耗时为：(1500ms ~ 500ms)，测试 3 次。

// 测试同步：26950ms、26428ms、26771ms
// 最大时间：（任务数 / 并发数）并发次数 * 并发队列中耗时最长的任务时间
// ps.running(callbacks, false).then(v =>
// {
//     console.log("thenSync:", v);
//     console.log(ps.kills());
// });

// 测试异步：19598ms、20176ms、20442ms
// 最大时间：？？？
// ps.running(callbacks, true).then(v =>
// {
//     console.log("then:", v);
//     console.log(ps.kills());
// });

ps.running(callbacks, false).then(v =>
{
    console.log("thenSync:", v);
    console.log(ps.kills());
});
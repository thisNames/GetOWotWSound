const { Worker, isMainThread } = require("worker_threads");

function task()
{
    while (true)
    {
        console.log("task");
    }
}

if (isMainThread)
{
    const w = new Worker(__filename);
    console.log("main ccc");
}
else
{
    task()
}
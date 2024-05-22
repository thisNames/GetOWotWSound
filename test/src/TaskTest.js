const rTime = (max, min) => Math.ceil(Math.random() * (max - min) + min + 1);
const fs = require("node:fs");
function task(data)
{
    const t = rTime(1500, 500);
    const startLine = `${process.pid} start task: ${data} in time ${t} ms`;
    console.log(startLine);
    const line = `${process.pid} run task: ${data}, out time ${t}ms`

    fs.writeFileSync("hello.txt", t.toFixed(), { encoding: "utf-8", flag: "a" });

    setTimeout(() =>
    {
        console.log(line);
        console.log("-----------");
        process.send("OK " + process.pid);
    }, t);
}
process.on("message", task);

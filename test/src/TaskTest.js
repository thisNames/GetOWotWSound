const sTime = (max, min) => Math.ceil(Math.random() * (max - min) + min + 1);

function task(data)
{
    const t = sTime(1500, 500);
    const sMsg = `cp ${process.pid} start ${t}ms task ${data}`
    console.log(sMsg);

    const line = `cp ${process.pid} out ${t}ms task${data}`;

    setTimeout(() =>
    {
        console.log(line);
        process.send("OK")
    }, t);
}
process.on("message", task);
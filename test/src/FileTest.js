const fs = require("node:fs");

const fileId = fs.openSync("hello.txt", "w"); // 11ms

for (let i = 0; i < 1000; i++)
{
    const line = i + "WWW" + "\r\n";
    try
    {
        // fs.writeFileSync("hello.txt", line, { flag: "a" }); // 123ms
        fs.writeFileSync(fileId, line); // 123ms

    } catch (error)
    {
        console.error("writeFileSync error:", error.message);
    }
}

fs.closeSync(fileId);
fs.closeSync()
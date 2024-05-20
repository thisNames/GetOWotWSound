console.log("可测试的 js 文件\n");

const fs = require("node:fs");
const readline = require("readline");

const listSc = fs.readdirSync("./src");
listSc.forEach((sc, index) =>
{
    console.log(index, sc);
});


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("\n----------------------------------------------");

rl.question('要测试的 js 文件，输入 id，以一个空格分开: ', (answer) =>
{
    const jsList = answer.split(" ").map(i => Number.parseInt(i));
    console.log("测试：", jsList);
    const s = Date.now();

    for (let i = 0; i < jsList.length; i++)
    {
        console.log(">>>");
        const jsIndex = jsList[i];
        const js = listSc[jsIndex];

        if (js === undefined)
        {
            console.log("not found: ", jsIndex);
            continue;
        }
        const abs = "./src/" + js;

        console.log(`开始测试 ${jsIndex}`, abs);
        console.log("----------------------------------------------");

        const s = require(abs);

        console.log("----------------------------------------------");
        console.log("返回结果：", s);
    }
    rl.close();
    console.log("--------------------exit----------------------");
    process.on("exit", () => console.log(Date.now() - s + "ms exit"));
});

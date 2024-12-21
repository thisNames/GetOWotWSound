const namespace = require("../../src/class");

// const gc = new namespace.GlobalCmd();
const gc = namespace.GlobalCmd.CLine();


// 混合测试
gc.append("input").param(p =>
{
    console.log("param:", p);
}).append("output").param(p =>
{
    console.log("param:", p);
}).run(cmd =>
{
    console.log("run1:", cmd);
}, cmd =>
{
    console.log("failing1:", cmd);
});

gc.param(p =>
{
    console.log("param pp1:", p);
}).append("world").run(cmd =>
{
    console.log("run1-2:", cmd);
}, cmd =>
{
    console.log("failing1-2:", cmd);
});

console.log("----------------------");

// 无参测试
gc.append("hello").run(cmd =>
{
    console.log("run2:", cmd);
}, cmd =>
{
    console.log("failing2:", cmd);
});

gc.append("hello").run(cmd =>
{
    console.log("run3:", cmd);
}, cmd =>
{
    console.log("failing3:", cmd);
});

gc.append("hello").run(cmd =>
{
    console.log("run4:", cmd);
}, cmd =>
{
    console.log("failing4:", cmd);
});

console.log("----------------------");

// 只有参数测试
gc.param(p =>
{
    console.log("param 1p:", p);
}).param(p =>
{
    console.log("param 2p:", p);
}).run(cmd =>
{
    console.log("run5:", cmd);
}, cmd =>
{
    console.log("failing5:", cmd);
});

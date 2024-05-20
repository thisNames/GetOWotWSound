/** 测试 MessageCollect 类 */
const namespace = require("../../src/class");

const config = new namespace.Config("config", "config.properties");

const mc = new namespace.MessageCollect("hello", config.logPath);

// mc.collectLine("HUIH&*UTQW", true);
// mc.collectLine("HUIH&*UTQW", true);
// mc.collectLine("HUIH&*UTQW", true);
// mc.collectLine("HUIH&*UTQW", true);
// mc.collectLine("HUIH&*UTQW", true);

console.log(1111);

// mc.collectDetail("dwdwf dwd ", "buffer", true, "F:WWWW", "C:WDW", 1223);
// mc.collectDetail("dwdwf dwd ", Buffer.from("ewfdwef"), true, "F:WWWW", "C:WDW", 1223);
// mc.collectDetail("dwdwf dwd ", null, true, "F:WWWW", "C:WDW", 1223);
// mc.collectDetail("dwdwf dwd ", undefined, true, "F:WWWW", "C:WDW", 1223);
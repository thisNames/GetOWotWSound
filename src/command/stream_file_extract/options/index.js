const fs = require("node:fs");
const os = require("node:os");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Tools = require("../../../class/Tools");

const OPT = require("./options");
const MaxThreadCount = Math.trunc(os.cpus().length * 2);
const MaxAsyncCount = 200;

/**
 *  显示可选项
 *  @returns {void}
 */
function printOptions()
{
    const logger = new LoggerSaver();

    for (const key in OPT)
    {
        if (Object.prototype.hasOwnProperty.call(OPT, key))
        {
            const value = OPT[key];
            logger.heighLight(`${key} = ${value}`, [key + " ="], LoggerSaver.GREEN);
        }
    }
}

/**
 *  设置路径相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void} 路径
 */
function setPath(key, value)
{
    if (!Object.hasOwnProperty.call(OPT, key)) return;

    let __value = (value + "").trim();

    // 是否是绝对路径
    let path = pt.isAbsolute(__value) ? __value : pt.join(process.cwd(), __value);
    let isExist = fs.existsSync(path);

    // 存在是目录
    if (isExist && fs.statSync(path).isDirectory())
    {
        Reflect.set(OPT, key, path);
        return;
    }

    // 路径被占用了
    if (isExist && !fs.statSync(path).isDirectory())
    {
        path = path + "_" + Tools.generateHashId(16);
    }

    try
    {
        fs.mkdirSync(path, { recursive: true });
        Reflect.set(OPT, key, path);
    } catch (error)
    {
        Reflect.set(OPT, key, process.cwd());
    }

}

/**
 *  设置数值相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void} 数字
 */
function setNumber(key, value)
{
    // 没用这样的属性
    if (!Object.hasOwnProperty.call(OPT, key)) return;

    let __value = Number.parseInt(value, 10);

    // 不是数字或者不是 > 2 数
    if (!Number.isFinite(__value) || __value < 2) return;

    // 特殊处理
    if (key === "threadNumber") __value = Math.min(__value, MaxThreadCount);
    else if (key === "asyncNumber") __value = Math.min(__value, MaxAsyncCount);

    Reflect.set(OPT, key, __value);
}

/**
 *  设置不二相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void}
 */
function setBoolean(key, value)
{
    // 没用这样的属性
    if (!Object.hasOwnProperty.call(OPT, key)) return;

    const __value = (value + "").trim().toLowerCase();
    const __trues = ["true", "t"];

    Reflect.set(OPT, key, __trues.includes(__value));
}

module.exports = {
    printOptions,
    setPath,
    setNumber,
    setBoolean
};

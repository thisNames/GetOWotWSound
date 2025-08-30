const os = require("node:os");

const LoggerSaver = require("../../../class/LoggerSaver");
const Logger = require("../../../class/Logger");

const Utils = require("../class/Utils");

const OPT = require("./options");
const MaxAsyncCount = os.cpus().length;
const MinAsyncCount = 2;

/**
 *  显示可选项
 *  @returns {void}
 */
function printOptions()
{
    const logger = new LoggerSaver();

    Utils.formatOutputObject(OPT).forEach(item =>
    {
        let color = Utils.trim(item.value) === "" ? LoggerSaver.RED : LoggerSaver.LIGHT_YELLOW;
        logger.heighLight(`${item.fKey} = ${item.value}`, [item.fKey], color);
    });
}

/**
 *  检查 options 配置 key 是否被定义
 *  @param {String} key 属性名称
 *  @returns {Boolean}
 */
function optionsHashKeyPrompt(key)
{
    if (Object.hasOwnProperty.call(OPT, key)) return true;

    Logger.error(key, "属性不存在");

    return false;
}

/**
 *  设置路径相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void} 路径
 */
function setPath(key, value)
{
    if (!optionsHashKeyPrompt(key)) return;

    Reflect.set(OPT, key, Utils.folderHandler(Utils.trim(value)));
}

/**
 *  设置数值相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void} 数字
 */
function setNumber(key, value)
{
    if (!optionsHashKeyPrompt(key)) return;

    let __value = Number.parseInt(value, 10);

    // 不是数字
    if (!Number.isFinite(__value)) return;

    // 特殊处理
    if (key == "asyncNumber") __value = Math.min(Math.max(MinAsyncCount, __value), MaxAsyncCount);

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
    if (!optionsHashKeyPrompt(key)) return;

    const __value = Utils.trim(value).toLowerCase();
    const __trues = ["true", "t"];

    Reflect.set(OPT, key, __trues.includes(__value));
}

/**
 *  设置枚举相关配置
 *  @param {String} key 属性名称
 *  @param {Number} value 属性值
 *  @returns {void}
 */
function setEnum(key, value)
{
    if (!optionsHashKeyPrompt(key)) return;

    let __value = Number.parseInt(value, 10);

    // 不是数字
    if (!Number.isFinite(__value)) return;

    Reflect.set(OPT, key, value);
}

/**
 *  设置字符串相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void}
 */
function setString(key, value)
{
    // 没用这样的属性
    if (!optionsHashKeyPrompt(key)) return;

    Reflect.set(OPT, key, Utils.trim(value));
}

/**
 *  设置文件相关配置
 *  @param {String} key 属性名称
 *  @param {String} value 属性值
 *  @returns {void}
 */
function setFilePath(key, value)
{
    // 没用这样的属性
    if (!optionsHashKeyPrompt(key)) return;

    Reflect.set(OPT, key, Utils.fileHandler(Utils.trim(value)));
}

module.exports = {
    printOptions,
    setPath,
    setNumber,
    setBoolean,
    setEnum,
    setString,
    setFilePath
};

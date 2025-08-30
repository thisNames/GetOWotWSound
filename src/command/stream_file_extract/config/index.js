const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");
const Logger = require("../../../class/Logger");

const DefaultConfig = require("../class/DefaultConfig");
const Utils = require("../class/Utils");

const CFG = require("./default_config");

/**
 *  检查 config 配置 key 是否被定义
 *  @param {String} key 属性名称
 *  @returns {Boolean}
 */
function configHashKeyPrompt(key)
{
    if (Object.hasOwnProperty.call(CFG, key)) return true;

    Logger.error(key, "属性不存在");

    return false;
}

/**
 *  显示配置
 *  @returns {void}
 */
function printConfig()
{
    const logger = new LoggerSaver();

    Utils.formatOutputObject(CFG).forEach(item =>
    {
        const color = item.value ? LoggerSaver.GREEN : LoggerSaver.RED;
        logger.heighLight(`${item.fKey} = ${item.value}`, [item.fKey], color);
    });
}

/**
 *  保存配置
 *  @returns {void}
 */
function saverConfig()
{
    const path = pt.join(__dirname, DefaultConfig.LOCAL_CONFIG);

    try
    {
        fs.writeFileSync(path, JSON.stringify(CFG), { encoding: "utf-8", flag: "w" });
        Logger.success("Saver success", path);
    } catch (error)
    {
        Logger.error("Saver failure", error.message);
    }
}

/**
 *  设置配置
 *  @param {String} key 配置名称
 *  @param {String} value 配置值
 *  @returns {void}
 */
function setConfig(key, value)
{
    if (!configHashKeyPrompt(key)) return;

    let __value = Utils.trim(value);

    // 没用有变化，默认使用原来的配置
    if (Reflect.get(CFG, key) === __value)
    {
        Logger.prompt(key, "No change");
        return;
    }

    // 更新
    Reflect.set(CFG, key, __value);
    Logger.info(key, "=", __value);
    saverConfig(CFG);
}

/**
 *  设置默认的配置信息
 *  @returns {void}
 */
function resetConfig()
{
    Logger.prompt("resetConfig");

    const def = new DefaultConfig();

    for (const key in def)
    {
        if (Object.prototype.hasOwnProperty.call(def, key))
        {
            const value = def[key];
            Reflect.set(CFG, key, value);
        }
    }

    saverConfig(CFG);
}

module.exports = {
    printConfig,
    saverConfig,
    setConfig,
    resetConfig
};

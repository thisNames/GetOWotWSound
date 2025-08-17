const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");

const DefaultConfig = require("../class/DefaultConfig");
const Utils = require("../class/Utils");

const CFG = require("./default_config");

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
 *  @returns {{ done: Boolean, msg: String }} 保存路径 | 错误信息
 */
function saverConfig()
{
    const savePath = pt.join(__dirname, DefaultConfig.LOCAL_CONFIG);

    try
    {
        const configData = JSON.stringify(CFG);

        fs.writeFileSync(savePath, configData, { encoding: "utf-8", flag: "w" });

        return {
            done: true,
            msg: savePath
        };
    } catch (error)
    {
        return {
            done: false,
            msg: error.message || "保存配置出错"
        };
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
    const logger = new LoggerSaver();
    let __value = Utils.trim(value);

    // 如果为空，设置失败
    if (!Object.hasOwnProperty.call(CFG, key))
    {
        logger.error(`[${key}] 没用这样的配置`);
        return;
    }

    // 没用有变化，默认使用原来的配置
    if (Reflect.get(CFG, key) === __value)
    {
        logger.light(`[${key}] 已经是最新的配置啦`);
        return;
    }

    // 更新
    Reflect.set(CFG, key, __value);

    const res = saverConfig(CFG);

    // 保存成功 | 失败
    if (res.done)
    {
        logger.success(`[${key}] 已保存 => ${res.msg}`);
    }
    else
    {
        logger.error(`[${key}] 保存失败 => ${res.msg}`);
    }
}

/**
 *  设置默认的配置信息
 *  @returns {void}
 */
function resetConfig()
{
    const def = new DefaultConfig();

    for (const key in def)
    {
        if (Object.prototype.hasOwnProperty.call(def, key))
        {
            const value = def[key];
            Reflect.set(CFG, key, value);
        }
    }

    saverConfig();
}

module.exports = {
    printConfig,
    saverConfig,
    setConfig,
    resetConfig
};

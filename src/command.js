/**
 *  自动注册参数命令模块
 *  @version 0.0.3
 */

const fs = require("node:fs");
const path = require("node:path");

// class
const ParamsMapping = require("./class/ParamsMapping");
const Params = require("./class/Params");
const Logger = require("./class/Logger");
const GlobalSingle = require("./config/GlobalSingle");

//#region 初始化常量
// 模块所在的目录名称
const COMMAND_DIR_NAME = "command";

// module.exports 的文件名称
const COMMAND_NAME = "command.js";

/** @type {Map<String, Params>} mayKey 参数命令映射表 */
const PARAMS_MAP = new Map();

/** @type {Map<String, Params>} params.key 参数命令映射表 */
const PARAMS_KEY_MAP = new Map();

/** @type {Array<Params>} 原始的参数命令集合 */
const ORIGIN_LIST_PARAMS_MAPPING = [];

/** @type {GlobalSingle} 布尔命令 */
const SINGLE_MAP = new GlobalSingle();
//#endregion

/**
 *  获取所有模块所在路径
 *  @version 0.0.3
 *  @returns {String[]} module.exports 文件路径集合
 */
function getParamsMappingModulesPath()
{
    const commandPath = path.join(__dirname, COMMAND_DIR_NAME);
    const modules = [];

    try
    {
        const folders = fs.readdirSync(commandPath, { encoding: "utf-8", withFileTypes: true });

        for (let i = 0; i < folders.length; i++)
        {
            const f = folders[i];

            if (f.isFile()) continue;

            modules.push(path.join(commandPath, f.name, COMMAND_NAME));
        }

    } catch (error)
    {
        Logger.error(`Module load error, ${error.message}. Please check command folder`);
        return modules;
    }

    return modules;
}

/**
 *  导入所有命令模块
 *  @version 0.0.2
 *  @param {Array<String>} models 模块的绝对路径
 *  @returns {Array<ParamsMapping>}
 */
function requiredModules(models)
{
    for (let i = 0; i < models.length; i++)
    {
        const model = models[i];
        let listParamsMapping = null;

        try
        {
            listParamsMapping = require(model);
        } catch (error)
        {
            Logger.error(`Module load error in [${model}]`);
            Logger.error(error.stack || error.message || "unknown error");
            continue;
        }

        if (!Array.isArray(listParamsMapping))
        {
            Logger.error(`Module return type error in [${model}], expected [Array<class/${ParamsMapping.name}>]`);
            continue;
        }

        for (let j = 0; j < listParamsMapping.length; j++)
        {
            const paramsMapping = listParamsMapping[j];

            if (paramsMapping instanceof Params || paramsMapping instanceof ParamsMapping)
            {
                paramsMapping.modulePath = model;
                ORIGIN_LIST_PARAMS_MAPPING.push(paramsMapping)
            }
        }
    }
}

/**
 *  设置参数命令的等级，并将所有的子命令都提取出来
 *  @version 0.0.3
 *  @param {Array<ParamsMapping>} listParamsMapping 参数命令集合
 *  @returns {Array<ParamsMapping>} 新的参数命令集合
 */
function setParamsMappingLevels(listParamsMapping, __level = 1, __mapKey = "", __key = "", __before = false, __parent = null)
{
    for (let i = 0; i < listParamsMapping.length; i++)
    {
        const paramsMapping = listParamsMapping[i];
        const levelChars = paramsMapping.accordingLevelRepeat ? (paramsMapping.linkSymbol + "").repeat(__level) : paramsMapping.linkSymbol;

        paramsMapping.__level = __level;
        paramsMapping.before = __level > 1 ? __before : paramsMapping.before;
        paramsMapping.parent = __parent;

        if (!paramsMapping.parentPrefix)
        {
            __mapKey = "";
            __key = "";
        }

        paramsMapping.mapKey = __mapKey + levelChars + paramsMapping.mapKey;
        paramsMapping.key = __key + levelChars + paramsMapping.key;

        setParamsMappingLevels(paramsMapping.children, __level + 1, paramsMapping.mapKey, paramsMapping.key, true, paramsMapping);
    }

    // 顺便注册参数命令
    registersParamsMapping(listParamsMapping);
}

/**
 *  注册参数命令到参数命令映射表
 *  @version 0.0.1
 *  @param {Array<ParamsMapping>} listParamsMapping 参数命令集合
 *  @returns {void}
 */
function registersParamsMapping(listParamsMapping)
{
    for (let i = 0; i < listParamsMapping.length; i++)
    {
        const paramsMapping = listParamsMapping[i];

        // 检测重复定义
        let includeMapKey = PARAMS_MAP.get(paramsMapping.mapKey);
        if (includeMapKey) repeatedlyDefinedError(`[mapKey] => ${paramsMapping.mapKey}`, includeMapKey.modulePath, paramsMapping.modulePath);

        let includeParamsKey = PARAMS_KEY_MAP.get(paramsMapping.key);
        if (includeParamsKey) repeatedlyDefinedError(`[key] => ${paramsMapping.key}`, includeParamsKey.modulePath, paramsMapping.modulePath);

        // 注册：两个映射表皆注册了当前命令的对象
        PARAMS_MAP.set(paramsMapping.mapKey, paramsMapping);
        PARAMS_KEY_MAP.set(paramsMapping.key, paramsMapping);
    }
}

/**
 *  抛出多次定义命令的错误信息
 *  @version 0.0.2
 *  @param {String} message 错误信息前缀
 *  @param {String} m1 模块 1 路径
 *  @param {String} m2 模块 2 路径
 */
function repeatedlyDefinedError(key = "unknownKey", m1 = "unknown1", m2 = "unknown2")
{
    let message = `Repeatedly defined command [${key}]:`;
    let error = `${message}\r\ndefined 1: ${m1}\r\ndefined 2: ${m2}`;
    throw new Error(error);
}

/**
 *  主函数，注册参数命令模块
 *  @version 0.0.2
 *  @returns {void}
 */
function main()
{
    // 获取模块的绝对路径
    const requiredPath = getParamsMappingModulesPath();

    // 导入所有的模块
    requiredModules(requiredPath);

    // 设置参数命令的等级，并注册参数命令
    setParamsMappingLevels(ORIGIN_LIST_PARAMS_MAPPING);
}

// 调用主函数
main();

module.exports = {
    PARAMS_MAP,
    SINGLE_MAP,
    PARAMS_KEY_MAP,
    ORIGIN_LIST_PARAMS_MAPPING
}

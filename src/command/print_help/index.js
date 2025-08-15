/**
 *  打印帮助
 */
const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../class/LoggerSaver");
const MainRunningMeta = require("../../class/MainRunningMeta");
const Params = require("../../class/Params");
const ParamsMapping = require("../../class/ParamsMapping");
const Tools = require("../../class/Tools");
const Single = require("../../class/Single");

const LINES = "=".repeat(20);

/**
 *  打印 packages.json
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printPackages(Logger)
{
    let package = null;

    try
    {
        package = require("../../../package.json");
    } catch (error)
    {
        return;
    }

    // 仓库
    const listRepository = package?.listRepository;
    if (Array.isArray(listRepository))
    {
        Logger.tip("[获取更多]");
        for (let i = 0; i < listRepository.length; i++)
        {
            const lr = listRepository[i];
            if (typeof lr !== "object") continue;

            Logger.info(`\t${lr.url} (${lr.type})`);
        }
    }
}

/**
 *  打印描述
 *  @param {MainRunningMeta} meta
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printDescriptions(meta, Logger)
{
    // 参数命令
    Logger.prompt("[参数命令]");

    /**
     * 打印子命令
     * @param {Array<Params>} params 
     * @returns {void}
     */
    function __print(params, __table = "")
    {
        for (let i = 0; i < params.length; i++)
        {
            const param = params[i];

            let __tableTmp = "" + __table;
            let line = `${__tableTmp}[${param.mapKey}, ${param.key}]: ${param.description}`;

            Logger.info(line);

            if (param.children.length < 1) continue;

            __print(param.children, __table + "\t");
        }

        Logger.line();
    }

    __print(meta.originListParamsMapping);

    // 布尔命令
    Logger.prompt("[布尔命令]");
    for (let key in meta.singleMap)
    {
        let single = meta.singleMap[key];
        Logger.info(`[${single.key}]: ${single.description}`);
    }
    Logger.line();

    printPackages(Logger);
}

/**
 *  打印版主文档
 *  @param {String} helpDocumentPath 帮助文档路径
 *  @param {String} key 命令
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printHelpDocument(key, helpDocumentPath, Logger)
{
    if (fs.existsSync(helpDocumentPath) && fs.statSync(helpDocumentPath).isFile())
    {
        try
        {
            let data = fs.readFileSync(helpDocumentPath, "utf-8");
            Logger.info(data);
        } catch (error)
        {
            Logger.error(error.message || "读取帮助文件失败");
        }
    }
    else
    {
        Logger.info("?_?");
        Logger.warn(`此命令[${key}]没有找到帮助描述文件`);
    }

    Logger.info(LINES);
}

/**
 *  打印参数命令对象模板
 *  @param {String} key 命令
 *  @param {Params} pm pm
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printParamsExamples(key, pm, Logger)
{
    let helpDocumentPath = pt.join(pt.dirname(pm.modulePath), pm.example + "");

    let counter = pm.count < 0 ? "不定长参数" : pm.count;
    let defaulter = pm.count <= 0 ? "无" : `[${pm.defaults.join(", ")}]`;

    Logger.prompt(`[${key}]: ${pm.description} [参数命令]`);
    Logger.tip("参数说明：");
    Logger.info(`\t参数个数：${counter}`).info(`\t默认参数：${defaulter}`);

    // 父命令
    if (pm.parent instanceof ParamsMapping || pm.parent instanceof Params)
    {
        Logger.tip("父命令：");
        Logger.info(`\t[${pm.parent.mapKey}, ${pm.parent.key}]: ${pm.parent.description}`);
    }

    // 子命令
    if (pm.children.length)
    {
        Logger.tip("子命令：")
        for (let i = 0; i < pm.children.length; i++)
        {
            const cpm = pm.children[i];
            Logger.info(`\t[${cpm.mapKey}, ${cpm.key}]: ${cpm.description}`);
        }
    }
    Logger.tip("说明文档：");
    printHelpDocument(key, helpDocumentPath, Logger);
}

/**
 *  打印参数命令对象模板
 *  @param {String} key 命令s
 *  @param {Single} single single
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printSingleExamples(key, single, Logger)
{
    let helpDocumentPath = pt.join(pt.dirname(single.modulePath), single.example + "");

    Logger.prompt(`${single.key}: ${single.description} [布尔命令]`).line();
    printHelpDocument(key, helpDocumentPath, Logger);
}

/**
 *  打印模板
 *  @param {MainRunningMeta} meta meta
 *  @param {Array<String>} params 参数数组
 *  @param {LoggerSaver} Logger 日志记录器
 *  @returns {void}
 */
function printExamples(meta, params, Logger)
{
    /** @type {Map<String, Single>} */
    const singleMap = Tools.objectFMap(meta.singleMap, (k, v) => v.key, (k, v) => v);

    for (let i = 0; i < params.length; i++)
    {
        const key = params[i];
        let exp = meta.paramsMap.get(key) || meta.paramsKeyMap.get(key) || singleMap.get(key);

        // 没有找到
        if (!exp)
        {
            Logger.error(`没有找到对应的命令[${key}]`);
            continue;
        }

        if (exp instanceof Params)
        {
            printParamsExamples(key, exp, Logger);
            continue;
        }

        if (exp instanceof Single)
        {
            printSingleExamples(key, exp, Logger);
        }
    }
}

/**
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    const Logger = new LoggerSaver(taskName, meta.cwd, false);

    let hIndex = process.argv.findIndex(key => key == meta.key);
    let __params = [...new Set(process.argv.slice(hIndex + 1, process.argv.length))];

    // 简单描述
    if (__params.length < 1)
    {
        printDescriptions(meta, Logger);

        Logger.close();
        return;
    }

    // 打印帮助模板
    printExamples(meta, __params, Logger);

    Logger.close();
}


module.exports = main;
